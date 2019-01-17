import { Injectable } from '@nestjs/common';
import { PaymentRejectedException } from '../exceptions/payment-rejected.exception';
import { PaymentDto } from '../dto/payment.dto';

@Injectable()
export class PaymentService {
  pay(payment: PaymentDto): boolean {
    if (Math.random() > 0.5) {
      return true;
    }
    throw new PaymentRejectedException();
  }
}
