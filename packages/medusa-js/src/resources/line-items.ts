import BaseResource from './base';
import * as Types from '../types';

class LineItemsResource extends BaseResource {
  /**
   * Creates a line-item for a cart
   * @param cart_id id of cart
   * @param payload details needed to create a line-item
   * @returns AsyncResult<{ cart: Cart }>
   */
  create(cart_id: string, payload: Types.LineItemCreatePayload): Types.AsyncResult<{ cart: Types.Cart }> {
    const path = `/store/carts/${cart_id}/line-items`;
    return this.client.request('POST', path, payload);
  }

  /**
   * Updates a line-item.
   * Only quantity updates are allowed
   * @param cart_id id of cart
   * @param line_id id of item to update
   * @param payload details needed to update a line-item
   * @returns AsyncResult<{ cart: Cart }>
   */
  update(
    cart_id: string,
    line_id: string,
    payload: Types.LineItemUpdatePayload,
  ): Types.AsyncResult<{ cart: Types.Cart }> {
    const path = `/store/carts/${cart_id}/line-items/${line_id}`;
    return this.client.request('POST', path, payload);
  }

  /**
   * Remove a line-item from a cart
   * @param cart_id id of cart
   * @param line_id id of item to remove
   * @returns AsyncResult<{ cart: Cart }>
   */
  delete(cart_id: string, line_id: string): Types.AsyncResult<{ cart: Types.Cart }> {
    const path = `/store/carts/${cart_id}/line-items/${line_id}`;
    return this.client.request('DELETE', path);
  }
}

export default LineItemsResource;
