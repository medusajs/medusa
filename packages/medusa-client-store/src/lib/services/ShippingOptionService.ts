/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { StoreGetShippingOptionsParams } from '../models/StoreGetShippingOptionsParams';
import type { StoreShippingOptionsListRes } from '../models/StoreShippingOptionsListRes';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class ShippingOptionService {

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
      url: '/shipping-options',
      headers: customHeaders,
      query: {
        'is_return': queryParams.is_return,
        'product_ids': queryParams.product_ids,
        'region_id': queryParams.region_id,
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
   * GetShippingOptionsCartId
   * List for Cart
   * Retrieves a list of Shipping Options available to a cart.
   * @returns StoreShippingOptionsListRes OK
   * @throws ApiError
   */
  public listCartOptions(
    cartId: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<StoreShippingOptionsListRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/shipping-options/{cart_id}',
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
