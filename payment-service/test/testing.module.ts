import { Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
// import { PaymentModule } from '../src/payment.module';
import { TestController } from './test.controller';
import { TestTCPService } from './test.service';

@Module({
  providers: [TestTCPService],
  controllers: [TestController]
})
export class TestingModule implements OnModuleInit, OnModuleDestroy {
  constructor(private readonly testTCPService: TestTCPService) {}

  onModuleDestroy() {
    this.testTCPService.close();
  }

  async onModuleInit() {
    await this.testTCPService.connect();
  }
}
