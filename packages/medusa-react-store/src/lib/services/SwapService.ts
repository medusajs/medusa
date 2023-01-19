/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { StorePostSwapsReq } from '../models/StorePostSwapsReq';
import type { StoreSwapsRes } from '../models/StoreSwapsRes';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class SwapService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * PostSwaps
   * Create a Swap
   * Creates a Swap on an Order by providing some items to return along with some items to send back
   * @returns StoreSwapsRes OK
   * @throws ApiError
   */
  public create(
    requestBody: StorePostSwapsReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<StoreSwapsRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/swaps',
      headers: customHeaders,
      body: requestBody,
      mediaType: 'application/json',
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
   * GetSwapsSwapCartId
   * Get by Cart ID
   * Retrieves a Swap by the id of the Cart used to confirm the Swap.
   * @returns StoreSwapsRes OK
   * @throws ApiError
   */
  public retrieveByCartId(
    cartId: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<StoreSwapsRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/swaps/{cart_id}',
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
