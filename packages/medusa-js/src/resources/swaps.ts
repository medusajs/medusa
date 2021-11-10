import BaseResource from './base';
import * as Types from '../types';

class SwapsResource extends BaseResource {
  /**
   * @description Creates a swap from a cart
   * @param payload contains the id of the cart
   * @returns AsyncResult<{ swap: Swap }>
   */
  create(payload: { cart_id: string }): Types.AsyncResult<{ swap: Types.Swap }> {
    const path = `/store/swaps`;
    return this.client.request('POST', path, payload);
  }

  /**
   * @description Retrieves a swap by cart id
   * @param cart_id id of cart
   * @returns AsyncResult<{ swap: Swap }>
   */
  retrieveByCartId(cart_id: string): Types.AsyncResult<{ swap: Types.Swap }> {
    const path = `/store/swaps/${cart_id}`;
    return this.client.request('GET', path);
  }
}

export default SwapsResource;
