import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, State } from '../entities/order.entity';
import { PaymentService } from './payment.service';
import { EntityNotFoundException } from '../exceptions/entity-not-found.exception';
import { ApiError } from '../interfaces/api-error.interface';
import { ApiValidationError } from '../interfaces/api-validation-error.interface';
import { PaymentResult } from '../interfaces/payment-result.interface';
import { ValidationFailedException } from '../exceptions/validation-failed.exception';

@Injectable()
export class OrderService {

  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly paymentService: PaymentService
  ) {}

  async create(): Promise<Order> {
    const order = new Order();
    await this.orderRepository.save(order);
    const response = await this.paymentService.pay(order);
    
    if ((<ApiError>response).error) {
      if ((<ApiError>response).message === 'payment rejected') {
        order.state = 'cancelled';
        await this.orderRepository.save(order);
      } else if ((<ApiError>response).message === 'validation failed') {
        await this.orderRepository.remove(order);
        throw new ValidationFailedException((<ApiValidationError>response).errors);
      }
    } else if ((<PaymentResult>response).result){
      order.state = 'confirmed';
      await this.orderRepository.save(order);
    }
    return order;
  }

  async updateState(id: number, state: State): Promise<Order> {
    const order: Order = await this.getOrder(id);
    
    order.state = state;
    await this.orderRepository.save(order);
    return order;
  }

  async getOrder(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne(id);
    if (!order) {
      throw new EntityNotFoundException();
    }
    return order;
  }
}
