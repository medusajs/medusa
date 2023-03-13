/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import {
  StorePostReturnsReq,
  StoreReturnsRes,
} from '@medusajs/client-types';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class ReturnsService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * PostReturns
   * Create Return
   * Creates a Return for an Order.
   * @returns StoreReturnsRes OK
   * @throws ApiError
   */
  public create(
    requestBody: StorePostReturnsReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<StoreReturnsRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/store/returns',
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

}
