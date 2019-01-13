import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsController } from './payments.controller';
import { PaymentService } from '../services/payment.service';
import { PaymentDto } from '../dto/payment.dto';

describe('PaymentsController', () => {
  let app: TestingModule;
  let paymentDto: PaymentDto;

  let paymentsController: PaymentsController;
  let paymentService: PaymentService;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [PaymentsController],
      providers: [PaymentService],
    }).compile();

    paymentsController = app.get<PaymentsController>(PaymentsController);
    paymentService = app.get<PaymentService>(PaymentService);

    paymentDto = new PaymentDto();
  });

  describe('pay', () => {
    it('should call paymentService `pay()` with `paymentDto`', () => {
      const mockFn = jest.fn(() => true);
      jest.spyOn(paymentService, 'pay').mockImplementation(mockFn);

      paymentsController.pay(paymentDto);
      
      expect(mockFn).toBeCalled();
      expect(mockFn).toBeCalledWith(paymentDto);
    });
  });
});
