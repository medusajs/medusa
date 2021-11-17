import { AxiosPromise } from 'axios';
import { StoreSwapsRes, StorePostSwapsReq } from '@medusajs/medusa';
import BaseResource from './base';

class SwapsResource extends BaseResource {
  /**
   * @description Creates a swap from a cart
   * @param payload 
   * @returns AxiosPromise<StoreSwapsRes>
   */
  create(payload: StorePostSwapsReq): AxiosPromise<StoreSwapsRes> {
    const path = `/store/swaps`;
    return this.client.request('POST', path, payload);
  }

  /**
   * @description Retrieves a swap by cart id
   * @param cart_id id of cart
   * @returns AxiosPromise<StoreSwapsRes>
   */
  retrieveByCartId(cart_id: string): AxiosPromise<StoreSwapsRes> {
    const path = `/store/swaps/${cart_id}`;
    return this.client.request('GET', path);
  }
}

export default SwapsResource;
