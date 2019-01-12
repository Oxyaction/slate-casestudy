import { Module } from '@nestjs/common';
import { PaymentsController } from './controllers/payments.controller';
import { PaymentService } from './services/payment.service';

@Module({
  imports: [],
  controllers: [PaymentsController],
  providers: [PaymentService],
})
export class PaymentModule {}
