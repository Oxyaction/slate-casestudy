import { Controller, Get, Post, Param, Put } from '@nestjs/common';
import { OrderService } from '../services/order.service';
import { Order } from '../interfaces/order.interface';

@Controller('orders')
export class OrdersController {
  constructor(private readonly orderService: OrderService) {}

  @Get(':id')
  findOne(@Param('id') id) {
    return { a: 35 };
    // return this.orderService.get(id);
  }

  @Post()
  create() {
    
  }

  @Put(':id')
  update(@Param('id') id) {

  }
}
