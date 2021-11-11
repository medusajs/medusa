import BaseResource from './base';
import * as Types from '../types';

class PaymentMethodsResource extends BaseResource {
  /**
   * Lists customer payment methods
   * @param id id of cart
   * @returns AsyncResult<{ payment_methods: object[] }>
   */
  list(id: string): Types.AsyncResult<{ payment_methods: object[] }> {
    const path = `/store/carts/${id}/payment-methods`;
    return this.client.request('GET', path);
  }
}

export default PaymentMethodsResource;
