import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OrderService } from './order.service';
import { Order } from '../entities/order.entity';
import { EntityNotFoundException } from '../exceptions/entity-not-found.exception';

const mockRepository = {
  save() {},
  findOne() {}
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
      ],
      
    }).compile();

    orderService = app.get<OrderService>(OrderService);
  });

  describe('create', () => {
    it('should call OrderRepository.create with new Order', async () => {
      const saveMock = jest.fn();
      jest.spyOn(mockRepository, 'save').mockImplementation(saveMock);
      await orderService.create();

      expect(saveMock).toBeCalled();
      expect(saveMock.mock.calls[0][0]).toBeInstanceOf(Order);
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
});
