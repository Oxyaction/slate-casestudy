import { Injectable } from '@nestjs/common';
import { Transport, Client, ClientProxy } from '@nestjs/microservices';
import { Order } from '../entities/order.entity';

@Injectable()
export class PaymentService {
  @Client({
    transport: Transport.TCP,
    options: {
      host: process.env.PAYMENT_SERVICE_HOST,
      port: parseInt(process.env.SERVICE_PORT, 10)
    }
  })
  client: ClientProxy;

  pay(order: Order) {
    const pattern = { cmd: 'pay' };
    return this.client.send<any>(pattern, { orderId: order.id });
  }
}
