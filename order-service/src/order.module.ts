import { Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from './controllers/orders.controller';
import { OrderService } from './services/order.service';
import { PaymentService } from './services/payment.service';
import { Config } from './providers/config';
import { Order } from './entities/order.entity';
const config = require('config');

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: config.get('db.host'),
      port: 5432,
      username: config.get('db.username'),
      password: config.get('db.password'),
      database: config.get('db.database'),
      entities: [__dirname + '/entities/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Order])
  ],
  controllers: [OrdersController],
  providers: [OrderService, PaymentService, Config],
})
export class OrderModule implements OnModuleInit, OnModuleDestroy {
  constructor(private readonly paymentService: PaymentService) {}

  onModuleDestroy() {
    this.paymentService.close();
  }

  async onModuleInit() {
    await this.paymentService.connect();
  }
}
