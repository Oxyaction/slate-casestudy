import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { PaymentService } from '../services/payment.service';

@Controller()
export class PaymentsController {
  constructor(private readonly paymentService: PaymentService) {}

  @MessagePattern({ cmd: 'sum' })
  findAll() {
    return { test: 'foo' };
  }
}
