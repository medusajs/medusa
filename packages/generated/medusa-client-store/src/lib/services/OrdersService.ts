/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import {
  StoreGetOrdersParams,
  StoreOrdersRes,
  StorePostCustomersCustomerAcceptClaimReq,
  StorePostCustomersCustomerOrderClaimReq,
} from '@medusajs/client-types';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class OrdersService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * GetOrders
   * Look Up an Order
   * Look up an order using filters.
   * @returns StoreOrdersRes OK
   * @throws ApiError
   */
  public lookupOrder(
    queryParams: StoreGetOrdersParams,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<StoreOrdersRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/store/orders',
      headers: customHeaders,
      query: queryParams,
      errors: {
        400: `Client Error or Multiple Errors`,
        404: `Not Found Error`,
        409: `Invalid State Error`,
        422: `Invalid Request Error`,
        500: `Server Error`,
      },
    });
  }

  /**
   * PostOrdersCustomerOrderClaim
   * Claim an Order
   * Sends an email to emails registered to orders provided with link to transfer order ownership
   * @returns any OK
   * @throws ApiError
   */
  public requestCustomerOrders(
    requestBody: StorePostCustomersCustomerOrderClaimReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<any> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/store/orders/batch/customer/token',
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
   * GetOrdersOrderCartId
   * Get by Cart ID
   * Retrieves an Order by the id of the Cart that was used to create the Order.
   * @returns StoreOrdersRes OK
   * @throws ApiError
   */
  public retrieveByCartId(
    cartId: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<StoreOrdersRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/store/orders/cart/{cart_id}',
      path: {
        'cart_id': cartId,
      },
      headers: customHeaders,
      errors: {
        400: `Client Error or Multiple Errors`,
        404: `Not Found Error`,
        409: `Invalid State Error`,
        422: `Invalid Request Error`,
        500: `Server Error`,
      },
    });
  }

  /**
   * PostOrdersCustomerOrderClaimsCustomerOrderClaimAccept
   * Verify an Order Claim
   * Verifies the claim order token provided to the customer upon request of order ownership
   * @returns any OK
   * @throws ApiError
   */
  public confirmRequest(
    requestBody: StorePostCustomersCustomerAcceptClaimReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<any> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/store/orders/customer/confirm',
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
   * GetOrdersOrder
   * Get an Order
   * Retrieves an Order
   * @returns StoreOrdersRes OK
   * @throws ApiError
   */
  public retrieve(
    id: string,
    queryParams: {
      /**
       * (Comma separated) Which fields should be included in the result.
       */
      fields?: string,
      /**
       * (Comma separated) Which fields should be expanded in the result.
       */
      expand?: string,
    },
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<StoreOrdersRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/store/orders/{id}',
      path: {
        'id': id,
      },
      headers: customHeaders,
      query: queryParams,
      errors: {
        400: `Client Error or Multiple Errors`,
        404: `Not Found Error`,
        409: `Invalid State Error`,
        422: `Invalid Request Error`,
        500: `Server Error`,
      },
    });
  }

}
