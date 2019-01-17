import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OrdersController } from './orders.controller';
import { OrderService } from '../services/order.service';
import { Order } from '../entities/order.entity';
import { PaymentService } from '../services/payment.service';

const mockPaymentService = {
  pay: () => ({ result: true }),
};

const mockRepository = {
  save() {},
  findOne() {}
};


describe('OrdersController', () => {
  let app: TestingModule;
  let order: Order;
  let ordersController: OrdersController;
  let orderService: OrderService;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        OrderService,
        {
          provide: PaymentService,
          useValue: mockPaymentService,
        },
        {
          provide: getRepositoryToken(Order),
          useValue: mockRepository,
        },
      ],
    }).compile();

    order = {
      id: 25,
      state: 'created'
    };

    ordersController = app.get<OrdersController>(OrdersController);
    orderService = app.get<OrderService>(OrderService);
  });

  describe('/orders/check/:id', () => {
    it('should call `orderService.getOrder(id) and return value', async () => {
      const getOrderSpy = jest.spyOn(orderService, 'getOrder').mockImplementation(() => order);

      const _order: Order = await ordersController.checkStatus(order.id);

      expect(_order).toBe(order);
      expect(getOrderSpy).toBeCalled();
      expect(getOrderSpy).toBeCalledWith(order.id);
    });
  });

  describe('/orders/create', () => {
    it('should call `orderService.create()', async () => {
      const createSpy = jest.spyOn(orderService, 'create').mockReturnValue(order);

      const _order = await ordersController.create();

      expect(createSpy).toBeCalled();
      expect(_order).toBe(order);
    });
  });

  describe('/orders/cancel/:id', () => {
    it('should call `orderService.updateStatus()` with corresponding args', async () => {
      const createSpy = jest.spyOn(orderService, 'updateState').mockImplementation(() => null);
      const id = 25;

      await ordersController.cancel(id);

      expect(createSpy).toBeCalled();
      expect(createSpy).toBeCalledWith(25, 'cancelled');
    });
  });
});
