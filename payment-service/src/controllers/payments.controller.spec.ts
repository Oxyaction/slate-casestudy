import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsController } from './payments.controller';
import { PaymentService } from '../services/payment.service';

describe('PaymentsController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [PaymentsController],
      providers: [PaymentService],
    }).compile();
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      const appController = app.get<PaymentsController>(PaymentsController);
      expect(appController.findAll()).toBe('Hello World!');
    });
  });
});
