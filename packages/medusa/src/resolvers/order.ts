import { Arg, Query, Resolver } from 'type-graphql';
import { OrderService } from '../services/order';

@Resolver()
export class OrderResolver {
  private orderService: OrderService;

  constructor(orderService: OrderService) {
    this.orderService = orderService;
  }

  @Query(() => [Order])
  async orders(
    @Arg('limit', { nullable: true }) limit?: number,
    @Arg('offset', { nullable: true }) offset?: number,
    @Arg('order', { nullable: true }) order?: {
      field: string;
      direction: 'ASC' | 'DESC';
    }
  ): Promise<Order[]> {
    const query = {
      limit: limit ?? 10,
      offset: offset ?? 0,
      order: order ?? { field: 'created_at', direction: 'DESC' },
    };

    return this.orderService.list(query);
  }
}