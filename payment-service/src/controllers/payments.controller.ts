import { Controller, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { PaymentService } from '../services/payment.service';
import { PaymentRejectedFilter } from '../filters/payment-rejected.filter';
import { BadRequestFilter } from '../filters/bad-request.filter';
import { PaymentDto } from '../dto/payment.dto';
import { ApiError } from '../interfaces/api-error.interface';

@Controller()
export class PaymentsController {
  constructor(private readonly paymentService: PaymentService) {}

  @MessagePattern({ cmd: 'pay' })
  @UseFilters(PaymentRejectedFilter)
  @UsePipes(ValidationPipe)
  pay(payment: PaymentDto): boolean | ApiError {
    return this.paymentService.pay(payment);
  }
}
