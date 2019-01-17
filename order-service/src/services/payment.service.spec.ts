import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OrderService } from './order.service';
import { Order } from '../entities/order.entity';
import { ClientTCP } from '@nestjs/microservices';
import { EntityNotFoundException } from '../exceptions/entity-not-found.exception';
import { PaymentService } from './payment.service';

const mockRepository = {
  save() {},
  findOne() {}
};

describe('PaymentService', () => {
  let app: TestingModule;
  let paymentService: PaymentService;
  let order: Order;

  beforeAll(async () => {
    order = new Order();
    order.id = 23;
    order.state = 'created';

    app = await Test.createTestingModule({
      providers: [
        PaymentService,
      ],
    }).compile();

    paymentService = app.get<PaymentService>(PaymentService);
    paymentService.client = new ClientTCP({});
    jest.spyOn(paymentService.client, 'connect').mockImplementation(() => true);
  });

  describe('pay', () => {
    it('should call `client.send()` with given payment id', async () => {
      const sendMock = jest.spyOn(paymentService.client, 'send').mockImplementation(() => ({ toPromise: () => true }));

      await paymentService.pay(order);

      expect(sendMock).toBeCalled();
      expect(sendMock.mock.calls[0][0]).toEqual({ cmd: 'pay' });
      expect(sendMock.mock.calls[0][1].orderId).toBe(order.id);
    })
  });  
});
