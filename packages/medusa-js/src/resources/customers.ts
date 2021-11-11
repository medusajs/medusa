import { AxiosPromise } from 'axios';
import * as Types from '../types';
import AddressesResource from './addresses';
import BaseResource from './base';
import PaymentMethodsResource from './payment-methods';

class CustomerResource extends BaseResource {
  public paymentMethods = new PaymentMethodsResource(this.client);
  public addresses = new AddressesResource(this.client);

  /**
   * Creates a customer
   * @param payload information of customer
   * @returns { AxiosPromise<>}
   */
  create(payload: Types.CustomerCreateResource): AxiosPromise<> {
    const path = `/store/customers`;
    return this.client.request('POST', path, payload);
  }

  /**
   * Retrieves a customer
   * @param id id of customer
   * @return AsyncResult<{ customer: Customer }>
   */
  retrieve(id: string): Types.AsyncResult<{ customer: Types.Customer }> {
    const path = `/store/customers/${id}`;
    return this.client.request('GET', path);
  }

  /**
   * Updates a customer
   * @param id id of customer
   * @param payload information to update customer with
   * @return AsyncResult<{ customer: Customer }>
   */
  update(id: string, payload: Types.CustomerUpdateResource): Types.AsyncResult<{ customer: Types.Customer }> {
    const path = `/store/customers/${id}`;
    return this.client.request('POST', path, payload);
  }

  /**
   * Retrieve customer orders
   * @param id id of customer
   * @return AsyncResult<object[]>
   */
  listOrders(id: string): Types.AsyncResult<object> {
    const path = `/store/customers/${id}/orders`;
    return this.client.request('GET', path);
  }

  /**
   * Resets customer password
   * @param payload info used to reset customer password
   * @return AsyncResult<{ customer: Customer }>
   */
  resetPassword(payload: Types.CustomerResetPasswordResource): Types.AsyncResult<{ customer: Types.Customer }> {
    const path = `/store/customers/password-reset`;
    return this.client.request('POST', path, payload);
  }

  /**
   * Generates a reset password token
   * @param payload info used to generate token
   * @return AsyncResult<{ customer: Customer }>
   */
  generatePasswordToken(
    payload: Types.CustomerGeneratePasswordTokenResource,
  ): Types.AsyncResult<{ customer: Types.Customer }> {
    const path = `/store/customers/password-token`;
    return this.client.request('POST', path, payload);
  }
}

export default CustomerResource;
