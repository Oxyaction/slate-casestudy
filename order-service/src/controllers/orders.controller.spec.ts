import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrderService } from '../services/order.service';

describe('OrdersController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [OrderService],
    }).compile();
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      const ordersController = app.get<OrdersController>(OrdersController);
      // expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
