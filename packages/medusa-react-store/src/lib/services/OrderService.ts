/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { StoreGetOrdersParams } from '../models/StoreGetOrdersParams';
import type { StoreOrdersRes } from '../models/StoreOrdersRes';
import type { StorePostCustomersCustomerAcceptClaimReq } from '../models/StorePostCustomersCustomerAcceptClaimReq';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class OrderService {

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
      url: '/orders',
      headers: customHeaders,
      query: {
        'display_id': queryParams.display_id,
        'email': queryParams.email,
        'shipping_address': queryParams.shipping_address,
      },
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
      url: '/orders/cart/{cart_id}',
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
      url: '/orders/customer/confirm',
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
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<StoreOrdersRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/orders/{id}',
      path: {
        'id': id,
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

}
