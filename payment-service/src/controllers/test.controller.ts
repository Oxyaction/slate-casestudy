import { Controller, Post, Body, Query, HttpCode } from '@nestjs/common';
import {
  Client,
  ClientProxy,
  Transport,
} from '@nestjs/microservices';
import { PaymentDto } from '../dto/payment.dto';

@Controller()
export class TestController {
  @Client({ transport: Transport.TCP })
  client: ClientProxy;

  @Post()
  @HttpCode(200)
  call(@Query('command') cmd, @Body() data: PaymentDto): Promise<boolean> {
    return this.client.send<boolean>({ cmd }, data).toPromise();
  }
}
