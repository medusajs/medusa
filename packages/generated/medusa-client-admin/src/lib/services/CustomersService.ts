/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import {
  AdminCustomersListRes,
  AdminCustomersRes,
  AdminGetCustomersParams,
  AdminPostCustomersCustomerReq,
  AdminPostCustomersReq,
} from '@medusajs/client-types';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class CustomersService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * GetCustomers
   * List Customers
   * Retrieves a list of Customers.
   * @returns AdminCustomersListRes OK
   * @throws ApiError
   */
  public list(
    queryParams: AdminGetCustomersParams,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminCustomersListRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/admin/customers',
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
   * PostCustomers
   * Create a Customer
   * Creates a Customer.
   * @returns AdminCustomersRes OK
   * @throws ApiError
   */
  public create(
    requestBody: AdminPostCustomersReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminCustomersRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/admin/customers',
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
   * GetCustomersCustomer
   * Get a Customer
   * Retrieves a Customer.
   * @returns AdminCustomersRes OK
   * @throws ApiError
   */
  public retrieve(
    id: string,
    queryParams: {
      /**
       * (Comma separated) Which fields should be expanded in the customer.
       */
      expand?: string,
      /**
       * (Comma separated) Which fields should be included in the customer.
       */
      fields?: string,
    },
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminCustomersRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/admin/customers/{id}',
      path: {
        'id': id,
      },
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
   * PostCustomersCustomer
   * Update a Customer
   * Updates a Customer.
   * @returns AdminCustomersRes OK
   * @throws ApiError
   */
  public update(
    id: string,
    requestBody: AdminPostCustomersCustomerReq,
    queryParams: {
      /**
       * (Comma separated) Which fields should be expanded in each customer.
       */
      expand?: string,
      /**
       * (Comma separated) Which fields should be retrieved in each customer.
       */
      fields?: string,
    },
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminCustomersRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/admin/customers/{id}',
      path: {
        'id': id,
      },
      headers: customHeaders,
      query: queryParams,
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
