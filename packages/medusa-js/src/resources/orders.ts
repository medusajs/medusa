import BaseResource from './base';
import * as Types from '../types';

class OrdersResource extends BaseResource {
  /**
   * @description Retrieves an order
   * @param id is required
   * @returns AsyncResult<{ order: Order }>
   */
  retrieve(id: string): Types.AsyncResult<{ order: Types.Order }> {
    const path = `/store/orders/${id}`;
    return this.client.request('GET', path);
  }

  /**
   * @description Retrieves an order by cart id
   * @param cart_id is required
   * @returns AsyncResult<{ order: Order }>
   */
  retrieveByCartId(cart_id: string): Types.AsyncResult<{ order: Types.Order }> {
    const path = `/store/orders/cart/${cart_id}`;
    return this.client.request('GET', path);
  }

  /**
   * @description Look up an order using order details
   * @param payload details used to look up the order
   * @returns AsyncResult<{ order: Order }>
   */
  lookupOrder(payload: Types.OrderLookUpPayload): Types.AsyncResult<{ order: Types.Order }> {
    let path = `/store/orders?`;

    const queryString = Object.entries(payload).map(([key, value]) => {
      let val = value;
      if (Array.isArray(value)) {
        val = value.join(',');
      }

      return `${key}=${encodeURIComponent(val)}`;
    });
    path = `/store/orders?${queryString.join('&')}`;

    return this.client.request('GET', path, payload);
  }
}

export default OrdersResource;
