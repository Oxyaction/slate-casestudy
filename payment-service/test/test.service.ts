import { Injectable } from '@nestjs/common';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';
import { PaymentDto } from 'src/dto/payment.dto';

@Injectable()
export class TestTCPService {
  @Client({ transport: Transport.TCP })
  client: ClientProxy;

  close() {
    this.client.close();
  }

  async connect() {
    await this.client.connect();
  }

  async pay(payment: PaymentDto) {
    return await this.client.send<boolean>({ cmd: 'pay' }, payment).toPromise();
  }
}