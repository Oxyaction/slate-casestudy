import { Controller, Get, Param, Post, Put, UseFilters } from '@nestjs/common';
import { EntityNotFoundFilter } from '../filters/entity-not-found.filter';
import { ValidationFailedFilter } from '../filters/validation-failed.filter';
import { OrderService } from '../services/order.service';
import { Order } from 'src/entities/order.entity';

@Controller('orders')
@UseFilters(EntityNotFoundFilter, ValidationFailedFilter)
export class OrdersController {
  constructor(
    private readonly orderService: OrderService
  ) {}

  @Get('check/:id')
  async checkStatus(@Param('id') id): Promise<Order> {
    return await this.orderService.getOrder(id);
  }

  @Post()
  async create(): Promise<Order> {
    return await this.orderService.create();
  }

  @Put('cancel/:id')
  async cancel(@Param('id') id): Promise<Order> {
    return await this.orderService.updateState(id, 'cancelled');
  }
}
