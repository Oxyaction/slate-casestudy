import { Controller, Get, Post, Param, Put, UseFilters } from '@nestjs/common';
import { OrderService } from '../services/order.service';
import { PaymentService } from '../services/payment.service';
import { Order } from '../interfaces/order.interface';
import { EntityNotFoundFilter } from '../filters/entity-not-found.filter';

@Controller('orders')
@UseFilters(EntityNotFoundFilter)
export class OrdersController {
  constructor(
    private readonly orderService: OrderService,
    private readonly paymentService: PaymentService
  ) {}

  @Get(':id')
  async findOne(@Param('id') id) {
    const a = await this.orderService.getOrder(id);
    console.log(a);
    return a;
    
    // return this.orderService.get(id);
  }

  @Post()
  create() {
    
  }

  @Put(':id')
  update(@Param('id') id) {

  }

  
}
