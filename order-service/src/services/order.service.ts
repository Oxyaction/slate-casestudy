import { Injectable } from '@nestjs/common';
import { Order, Status } from '../interfaces/order.interface';

@Injectable()
export class OrderService {
  private readonly orders: Order[] = [];

  create() {
    this.orders.push(new Order(this.orders.length, Status.Created, '2018'));
  }

  get(id: number): Order {
    return this.findOrder(id);
  }

  updateStatus(id: number, status: Status) {
    const order = this.findOrder(id);
    // order.status = 
  }

  protected findOrder(id: number) {
    return this.orders.find(order => order.id === id);
  }
}
