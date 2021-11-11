import { StoreGetOrdersReq, StoreOrderResponse } from '@medusajs/medusa';
import { AxiosPromise } from 'axios';
import BaseResource from './base';

class OrdersResource extends BaseResource {
  /**
   * @description Retrieves an order
   * @param {string} id is required
   * @return {AxiosPromise<StoreOrderResponse>}
   */
  retrieve(id: string): AxiosPromise<StoreOrderResponse> {
    const path = `/store/orders/${id}`;
    return this.client.request('GET', path);
  }

  /**
   * @description Retrieves an order by cart id
   * @param {string} cart_id is required
   * @return {AxiosPromise<StoreOrderResponse>}
   */
  retrieveByCartId(cart_id: string): AxiosPromise<StoreOrderResponse> {
    const path = `/store/orders/cart/${cart_id}`;
    return this.client.request('GET', path);
  }

  /**
   * @description Look up an order using order details
   * @param {StoreGetOrdersReq} payload used to look up the order
   * @return {AxiosPromise<StoreOrderResponse>}
   */
  lookupOrder(payload: StoreGetOrdersReq): AxiosPromise<StoreOrderResponse> {
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
