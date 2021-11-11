import BaseResource from './base';
import * as Types from '../types';

class GiftCardsResource extends BaseResource {
  /**
   * @description Retrieves a single GiftCard
   * @param code code of the gift card
   * @returns AsyncResult<{ gift_card: GiftCard }>
   */
  retrieve(id: string): Types.AsyncResult<{ product: Types.Product }> {
    const path = `/store/gift-cards/${id}`;
    return this.client.request('GET', path);
  }
}

export default GiftCardsResource;
