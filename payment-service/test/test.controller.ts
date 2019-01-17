import { Controller, Post, Body, Query, HttpCode } from '@nestjs/common';
import { PaymentDto } from '../src/dto/payment.dto';
import { TestTCPService } from './test.service';

@Controller()
export class TestController {
  constructor(private readonly testTCPService: TestTCPService) {}

  @Post()
  @HttpCode(200)
  async call(@Query('command') cmd, @Body() data: PaymentDto): Promise<any> {
    return await this.testTCPService.pay(data);
  }
}
