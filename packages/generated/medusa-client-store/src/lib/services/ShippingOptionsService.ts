/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import {
  StoreCartShippingOptionsListRes,
  StoreGetShippingOptionsParams,
  StoreShippingOptionsListRes,
} from '@medusajs/client-types';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class ShippingOptionsService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * GetShippingOptions
   * Get Shipping Options
   * Retrieves a list of Shipping Options.
   * @returns StoreShippingOptionsListRes OK
   * @throws ApiError
   */
  public list(
    queryParams: StoreGetShippingOptionsParams,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<StoreShippingOptionsListRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/store/shipping-options',
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
   * GetShippingOptionsCartId
   * List for Cart
   * Retrieves a list of Shipping Options available to a cart.
   * @returns StoreCartShippingOptionsListRes OK
   * @throws ApiError
   */
  public listCartOptions(
    cartId: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<StoreCartShippingOptionsListRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/store/shipping-options/{cart_id}',
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

}
