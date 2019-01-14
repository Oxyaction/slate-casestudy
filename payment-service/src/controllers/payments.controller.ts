import { Controller, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { PaymentService } from '../services/payment.service';
import { PaymentRejectedFilter } from '../filters/payment-rejected.filter';
import { ValidationFailedFilter } from '../filters/validation-failed.filter';
import { validationErrorsFactory } from '../exceptions/validation-errors.factory';
import { PaymentDto } from '../dto/payment.dto';
import { ApiError } from '../interfaces/api-error.interface';
import { PaymentResult } from '../interfaces/payment-result.interface';

@Controller()
export class PaymentsController {
  constructor(private readonly paymentService: PaymentService) {}

  @MessagePattern({ cmd: 'pay' })
  @UseFilters(PaymentRejectedFilter, ValidationFailedFilter)
  @UsePipes(new ValidationPipe({ exceptionFactory: validationErrorsFactory }))
  async pay(payment: PaymentDto): Promise<PaymentResult | ApiError> {
    const result = this.paymentService.pay(payment);
    return {
      result,
    };
  }
}
