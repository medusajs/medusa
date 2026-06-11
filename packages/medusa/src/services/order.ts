import { EntityManager } from 'typeorm';
import { Order } from '../entity';
import { OrderService } from './order';

// ...

export class OrderService {
  // ...

  async list(
    query: {
      limit: number;
      offset: number;
      order: { field: string; direction: 'ASC' | 'DESC' };
    },
    manager: EntityManager
  ): Promise<Order[]> {
    const { limit, offset, order } = query;

    const orderRepo = manager.getRepository(Order);

    const orders = await orderRepo
      .createQueryBuilder('order')
      .take(limit)
      .skip(offset)
      .orderBy(`order.${order.field}`, order.direction)
      .getMany();

    return orders;
  }
}