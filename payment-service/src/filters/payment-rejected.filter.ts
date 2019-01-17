
import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { PaymentRejectedException } from '../exceptions/payment-rejected.exception';

@Catch(PaymentRejectedException)
export class PaymentRejectedFilter implements ExceptionFilter {
  catch(exception: PaymentRejectedException, host: ArgumentsHost) {
    return {
      error: true,
      message: exception.message
    };
  }
}
