import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OrderService } from './order.service';
import { PaymentService } from './payment.service';
import { Order } from '../entities/order.entity';
import { EntityNotFoundException } from '../exceptions/entity-not-found.exception';
import { ValidationFailedException } from '../exceptions/validation-failed.exception';

const mockRepository = {
  save() {},
  findOne() {},
  remove() {},
};

const mockPaymentService = {
  pay: () => ({ result: true }),
};

describe('OrderService', () => {
  let app: TestingModule;
  let orderService: OrderService;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: getRepositoryToken(Order),
          useValue: mockRepository,
        },
        {
          provide: PaymentService,
          useValue: mockPaymentService
        }
      ],
      
    }).compile();

    orderService = app.get<OrderService>(OrderService);
  });

  describe('create', () => {
    it('should call `OrderRepository.create()` with new Order', async () => {
       const saveMock = jest.spyOn(mockRepository, 'save');
      
      await orderService.create();

      expect(saveMock).toBeCalled();
      expect(saveMock.mock.calls[0][0]).toBeInstanceOf(Order);
    });

    it('should call `PaymentService.pay() with new order', async () => {
      const payMock = jest.spyOn(mockPaymentService, 'pay');

      await orderService.create();

      expect(payMock).toBeCalled();
      expect(payMock.mock.calls[0][0]).toBeInstanceOf(Order);
    });

    it('should change order state to `confirmed` if paymentService approved payment', async () => {
      const saveMock = jest.fn();
      jest.spyOn(mockRepository, 'save').mockImplementation(saveMock);
      jest.spyOn(mockPaymentService, 'pay').mockImplementation(() => ({ result: true }));      

      await orderService.create();

      expect(saveMock).toBeCalled();
      expect(saveMock.mock.calls[1][0].state).toBe('confirmed');
    });

    it('should change order state `cancelled` if paymentService rejected payment', async () => {
      const saveMock = jest.fn();
      jest.spyOn(mockRepository, 'save').mockImplementation(saveMock);
      jest.spyOn(mockPaymentService, 'pay').mockImplementation(() => ({ error: true, message: 'payment rejected' }));    
      
      await orderService.create();

      expect(saveMock).toBeCalled();
      expect(saveMock.mock.calls[1][0].state).toBe('cancelled');
    });

    it('should delete order and return validation errors', async () => {
      const saveMock = jest.fn();
      jest.spyOn(mockRepository, 'save').mockImplementation(saveMock);
      const removeMock = jest.fn();
      jest.spyOn(mockRepository, 'remove').mockImplementation(removeMock);
      jest.spyOn(mockPaymentService, 'pay').mockImplementation(() => ({ error: true, message: 'validation failed', errors: [{
        attribute: 'cvv',
        errors: ['incorrect cvv code']
      }] }));

      expect.assertions(2);
      try {
        await orderService.create();
      } catch (e) {
        expect(e).toBeInstanceOf(ValidationFailedException);
        expect(removeMock).toBeCalled();
      } 
    });
  });

  describe('updateState', () => {
    const orderId = 101;
    const newState = 'confirmed';
    let order: Order;

    beforeEach(() => {
      order = new Order();
      order.id = orderId;
      order.state = 'created';
    })

    it('should update status for Order with given id', async () => {
      const findOneMock = jest.fn().mockReturnValue(order);
      jest.spyOn(mockRepository, 'findOne').mockImplementation(findOneMock);
      const saveMock = jest.fn();
      jest.spyOn(mockRepository, 'save').mockImplementation(saveMock);
      
      
      await orderService.updateState(orderId, newState);

      expect(findOneMock).toBeCalled();
      expect(findOneMock.mock.calls[0][0]).toBe(order.id)
      expect(saveMock).toBeCalled();
      
      const orderToSave: Order = saveMock.mock.calls[0][0];
      expect(orderToSave).toBeInstanceOf(Order);
      expect(orderToSave.id).toBe(orderId);
      expect(orderToSave.state).toBe(newState);
    });

    it('should throw not found exception if no Order with given id found', async () => {
      const findOneMock = jest.fn().mockReturnValue(undefined);
      jest.spyOn(mockRepository, 'findOne').mockImplementation(findOneMock);

      await expect(orderService.updateState(orderId, newState)).rejects.toThrow(EntityNotFoundException);
    });
  });

  describe('getOrder', () => {
    it('should return order', async () => {
      const id = 25;
      const order = new Order();
      order.id = id;
      order.state = 'created';

      const findOneMock = jest.fn().mockReturnValue(order);
      jest.spyOn(mockRepository, 'findOne').mockImplementation(findOneMock);

      const returnedOrder = await orderService.getOrder(id);

      expect(findOneMock).toBeCalled();
      expect(findOneMock.mock.calls[0][0]).toBe(id);
      expect(returnedOrder).toBe(order);
    });

    it('should throw `EntityNotFound` exception if no Order with given id found', async () => {
      const findOneMock = jest.fn().mockReturnValue(undefined);
      jest.spyOn(mockRepository, 'findOne').mockImplementation(findOneMock);

      await expect(orderService.getOrder(100)).rejects.toThrow(EntityNotFoundException);
    })
  });
});
