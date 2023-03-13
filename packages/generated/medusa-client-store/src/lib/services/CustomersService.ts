/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import {
  StoreCustomersListOrdersRes,
  StoreCustomersListPaymentMethodsRes,
  StoreCustomersRes,
  StoreCustomersResetPasswordRes,
  StoreGetCustomersCustomerOrdersParams,
  StorePostCustomersCustomerAddressesAddressReq,
  StorePostCustomersCustomerAddressesReq,
  StorePostCustomersCustomerPasswordTokenReq,
  StorePostCustomersCustomerReq,
  StorePostCustomersReq,
  StorePostCustomersResetPasswordReq,
} from '@medusajs/client-types';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class CustomersService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * PostCustomers
   * Create a Customer
   * Creates a Customer account.
   * @returns StoreCustomersRes OK
   * @throws ApiError
   */
  public create(
    requestBody: StorePostCustomersReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<StoreCustomersRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/store/customers',
      headers: customHeaders,
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        400: `Client Error or Multiple Errors`,
        404: `Not Found Error`,
        409: `Invalid State Error`,
        422: `A customer with the same email exists`,
        500: `Server Error`,
      },
    });
  }

  /**
   * GetCustomersCustomer
   * Get a Customer
   * Retrieves a Customer - the Customer must be logged in to retrieve their details.
   * @returns StoreCustomersRes OK
   * @throws ApiError
   */
  public retrieve(
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<StoreCustomersRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/store/customers/me',
      headers: customHeaders,
      errors: {
        400: `Client Error or Multiple Errors`,
        401: `User is not authorized. Must log in first`,
        404: `Not Found Error`,
        409: `Invalid State Error`,
        422: `Invalid Request Error`,
        500: `Server Error`,
      },
    });
  }

  /**
   * PostCustomersCustomer
   * Update Customer
   * Updates a Customer's saved details.
   * @returns StoreCustomersRes OK
   * @throws ApiError
   */
  public update(
    requestBody: StorePostCustomersCustomerReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<StoreCustomersRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/store/customers/me',
      headers: customHeaders,
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        400: `Client Error or Multiple Errors`,
        401: `User is not authorized. Must log in first`,
        404: `Not Found Error`,
        409: `Invalid State Error`,
        422: `Invalid Request Error`,
        500: `Server Error`,
      },
    });
  }

  /**
   * PostCustomersCustomerAddresses
   * Add a Shipping Address
   * Adds a Shipping Address to a Customer's saved addresses.
   * @returns StoreCustomersRes A successful response
   * @throws ApiError
   */
  public addAddress(
    requestBody: StorePostCustomersCustomerAddressesReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<StoreCustomersRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/store/customers/me/addresses',
      headers: customHeaders,
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        400: `Client Error or Multiple Errors`,
        401: `User is not authorized. Must log in first`,
        404: `Not Found Error`,
        409: `Invalid State Error`,
        422: `Invalid Request Error`,
        500: `Server Error`,
      },
    });
  }

  /**
   * PostCustomersCustomerAddressesAddress
   * Update a Shipping Address
   * Updates a Customer's saved Shipping Address.
   * @returns StoreCustomersRes OK
   * @throws ApiError
   */
  public updateAddress(
    addressId: string,
    requestBody: StorePostCustomersCustomerAddressesAddressReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<StoreCustomersRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/store/customers/me/addresses/{address_id}',
      path: {
        'address_id': addressId,
      },
      headers: customHeaders,
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        400: `Client Error or Multiple Errors`,
        401: `User is not authorized. Must log in first`,
        404: `Not Found Error`,
        409: `Invalid State Error`,
        422: `Invalid Request Error`,
        500: `Server Error`,
      },
    });
  }

  /**
   * DeleteCustomersCustomerAddressesAddress
   * Delete an Address
   * Removes an Address from the Customer's saved addresses.
   * @returns StoreCustomersRes OK
   * @throws ApiError
   */
  public deleteAddress(
    addressId: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<StoreCustomersRes> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/store/customers/me/addresses/{address_id}',
      path: {
        'address_id': addressId,
      },
      headers: customHeaders,
      errors: {
        400: `Client Error or Multiple Errors`,
        401: `User is not authorized. Must log in first`,
        404: `Not Found Error`,
        409: `Invalid State Error`,
        422: `Invalid Request Error`,
        500: `Server Error`,
      },
    });
  }

  /**
   * GetCustomersCustomerOrders
   * List Orders
   * Retrieves a list of a Customer's Orders.
   * @returns StoreCustomersListOrdersRes OK
   * @throws ApiError
   */
  public listOrders(
    queryParams: StoreGetCustomersCustomerOrdersParams,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<StoreCustomersListOrdersRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/store/customers/me/orders',
      headers: customHeaders,
      query: queryParams,
      errors: {
        400: `Client Error or Multiple Errors`,
        401: `User is not authorized. Must log in first`,
        404: `Not Found Error`,
        409: `Invalid State Error`,
        422: `Invalid Request Error`,
        500: `Server Error`,
      },
    });
  }

  /**
   * GetCustomersCustomerPaymentMethods
   * Get Payment Methods
   * Retrieves a list of a Customer's saved payment methods. Payment methods are saved with Payment Providers and it is their responsibility to fetch saved methods.
   * @returns StoreCustomersListPaymentMethodsRes OK
   * @throws ApiError
   */
  public listPaymentMethods(
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<StoreCustomersListPaymentMethodsRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/store/customers/me/payment-methods',
      headers: customHeaders,
      errors: {
        400: `Client Error or Multiple Errors`,
        401: `User is not authorized. Must log in first`,
        404: `Not Found Error`,
        409: `Invalid State Error`,
        422: `Invalid Request Error`,
        500: `Server Error`,
      },
    });
  }

  /**
   * PostCustomersResetPassword
   * Reset Password
   * Resets a Customer's password using a password token created by a previous /password-token request.
   * @returns StoreCustomersResetPasswordRes OK
   * @throws ApiError
   */
  public resetPassword(
    requestBody: StorePostCustomersResetPasswordReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<StoreCustomersResetPasswordRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/store/customers/password-reset',
      headers: customHeaders,
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        400: `Client Error or Multiple Errors`,
        401: `User is not authorized. Must log in first`,
        404: `Not Found Error`,
        409: `Invalid State Error`,
        422: `Invalid Request Error`,
        500: `Server Error`,
      },
    });
  }

  /**
   * PostCustomersCustomerPasswordToken
   * Request Password Reset
   * Creates a reset password token to be used in a subsequent /reset-password request. The password token should be sent out of band e.g. via email and will not be returned.
   * @returns void
   * @throws ApiError
   */
  public generatePasswordToken(
    requestBody: StorePostCustomersCustomerPasswordTokenReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<void> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/store/customers/password-token',
      headers: customHeaders,
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        400: `Client Error or Multiple Errors`,
        401: `User is not authorized. Must log in first`,
        404: `Not Found Error`,
        409: `Invalid State Error`,
        422: `Invalid Request Error`,
        500: `Server Error`,
      },
    });
  }

}
