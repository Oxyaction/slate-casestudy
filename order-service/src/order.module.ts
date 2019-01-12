import { Module } from '@nestjs/common';
import { OrdersController } from './controllers/orders.controller';
import { OrderService } from './services/order.service';

@Module({
  imports: [],
  controllers: [OrdersController],
  providers: [OrderService],
})
export class OrderModule {}
