import {
  StoreCustomerResponse,
  StoreGetCustomersCustomerOrdersResponse,
  StorePostCustomersCustomerAddressesAddressReq,
  StorePostCustomersReq,
  StorePostCustomersResetPasswordReq,
} from '@medusajs/medusa';
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
   * @param {Object} payload information of customer
   * @return { AxiosPromise<StoreCustomerResponse>}
   */
  create(payload: StorePostCustomersReq): AxiosPromise<StoreCustomerResponse> {
    const path = `/store/customers`;
    return this.client.request('POST', path, payload);
  }

  /**
   * Retrieves the customer that is currently logged
   * @return {AxiosPromise<StoreCustomerResponse>}
   */
  retrieve(): AxiosPromise<StoreCustomerResponse> {
    const path = `/store/customers/me`;
    return this.client.request('GET', path);
  }

  /**
   * Updates a customer
   * @param {StorePostCustomersCustomerAddressesAddressReq} payload information to update customer with
   * @return {AxiosPromise<StoreCustomerResponse>}
   */
  update(payload: StorePostCustomersCustomerAddressesAddressReq): AxiosPromise<StoreCustomerResponse> {
    const path = `/store/customers/me`;
    return this.client.request('POST', path, payload);
  }

  /**
   * Retrieve customer orders
   * @return {AxiosPromise<StoreGetCustomersCustomerOrdersResponse>}
   */
  listOrders(): AxiosPromise<StoreGetCustomersCustomerOrdersResponse> {
    const path = `/store/customers/me/orders`;
    return this.client.request('GET', path);
  }

  /**
   * Resets customer password
   * @param {StorePostCustomersResetPasswordReq} payload info used to reset customer password
   * @return {AxiosPromise<StoreCustomerResponse>}
   */
  resetPassword(payload: StorePostCustomersResetPasswordReq): AxiosPromise<StoreCustomerResponse> {
    const path = `/store/customers/password-reset`;
    return this.client.request('POST', path, payload);
  }

  /**
   * Generates a reset password token, which can be used to reset the password.
   * The token is not returned but should be sent out to the customer in an email.
   * @param {StorePostCustomersCustomerPasswordTokenReq} payload info used to generate token
   * @return {AxiosPromise}
   */
  generatePasswordToken(payload: Types.CustomerGeneratePasswordTokenResource): AxiosPromise {
    const path = `/store/customers/password-token`;
    return this.client.request('POST', path, payload);
  }
}

export default CustomerResource;
