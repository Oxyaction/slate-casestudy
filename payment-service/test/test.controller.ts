import { Controller, Post, Body, Query, HttpCode, Injectable } from '@nestjs/common';
// import {
//   Client,
//   ClientProxy,
//   Transport,
// } from '@nestjs/microservices';
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
