import { EntityManager } from 'typeorm';
import { OrderItem } from '../entity/order-item';

export class OrderItemService {
  async list(
    query: {
      limit: number;
      offset: number;
      order: { field: string; direction: 'ASC' | 'DESC' };
    },
    manager: EntityManager
  ): Promise<OrderItem[]> {
    const { limit, offset, order } = query;

    const orderItemRepo = manager.getRepository(OrderItem);

    const orderItems = await orderItemRepo
      .createQueryBuilder('orderItem')
      .take(limit)
      .skip(offset)
      .orderBy(`orderItem.${order.field}`, order.direction)
      .getMany();

    return orderItems;
  }
}