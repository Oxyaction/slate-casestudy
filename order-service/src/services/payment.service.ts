import { Injectable } from '@nestjs/common';
import { Transport, Client, ClientProxy } from '@nestjs/microservices';
import { Order } from '../entities/order.entity';
import { ApiError } from '../interfaces/api-error.interface';
import { PaymentResult } from '../interfaces/payment-result.interface';
const config = require('config');


@Injectable()
export class PaymentService {
  @Client({
    transport: Transport.TCP,
    options: {
      host: config.get('services.payment.host'),
      port: parseInt(config.get('services.payment.port'), 10)
    }
  })
  client: ClientProxy;

  pay(order: Order): Promise<PaymentResult | ApiError>{

    return this.client.send({ cmd: 'pay' }, {
      orderId: order.id,
      amount: 2000,
      cardNumber: '1111-1111-1111-1111',
      expiresMonth: 10,
      expiresYear: 2022,
      cvv: 111
    }).toPromise();
  }
}
