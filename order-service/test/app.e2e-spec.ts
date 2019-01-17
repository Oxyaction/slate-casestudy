import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Repository } from 'typeorm';
import * as request from 'supertest';
import { OrderModule } from '../src/order.module';
import { Connection } from 'typeorm';
import { OrderService } from '../src/services/order.service';
import { Order } from '../src/entities/order.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let connection: Connection;
  let orderService: OrderService;
  let orderRepository: Repository<Order>;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [OrderModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    connection = app.get<Connection>(Connection);
    orderService = app.get<OrderService>(OrderService);
    orderRepository = app.get<Repository<Order>>(getRepositoryToken(Order));

    await app.init();
  });

  afterAll(() => {
    setTimeout(async () => {
      try {
        // await connection.close();
        await app.close();
      } catch (e) {
        // console.error(e);
      }
    }, 2000);
  });

  describe('/orders (POST)', () => {
    it('should return newly created order and persist it in db', async () => {
      await request(app.getHttpServer())
        .post('/orders')
        .expect(async (res) => {
          expect(res.status).toBe(201);
          if (res.status !== 201) {
            throw new Error('201 status expected');
          }
          if (!res.body.state) {
            throw new Error('No state key');
          }
          if (!['cancelled', 'confirmed'].includes(res.body.state)) {
            throw new Error('Unknown state');
          }
          if (!res.body.id) {
            throw new Error('No id key');
          }
          
          const _order = await orderService.getOrder(res.body.id);
          expect(_order).toEqual(res.body);
        });
    });
  });

  describe('/orders/check/:id (GET)', () => {
    it('should return correct status for order', async () => {
      const order = new Order();
      await orderRepository.save(order);
      
      await request(app.getHttpServer())
        .get(`/orders/check/${order.id}`)
        .expect((res) => {
          expect(res.body).toEqual(order);
        });

      await orderRepository.remove(order);
    });

    it('should return 404 status on order not found', async () => {
      await request(app.getHttpServer())
        .get(`/orders/check/0`)
        .expect(404);
    });
  });

  describe('/orders/cancel/:id (PUT)', () => {
    it('should change state to cancelled', async () => {
      const order = new Order();
      await orderRepository.save(order);
      expect(order.state).toBe('created');
      
      await request(app.getHttpServer())
        .put(`/orders/cancel/${order.id}`)
        .expect((res) => {
          expect(res.body.state).toBe('cancelled');
        });
      
      const persistedOrder = await orderRepository.findOne(order.id);
      expect(persistedOrder.state).toBe('cancelled');

      await orderRepository.remove(order);
    });

    it('should return 404 status on order not found', async () => {
      await request(app.getHttpServer())
        .put(`/orders/cancel/0`)
        .expect(404);
    });
  });
});
