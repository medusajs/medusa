/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import {
  StoreReturnReasonsListRes,
  StoreReturnReasonsRes,
} from '@medusajs/client-types';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class ReturnReasonsService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * GetReturnReasons
   * List Return Reasons
   * Retrieves a list of Return Reasons.
   * @returns StoreReturnReasonsListRes OK
   * @throws ApiError
   */
  public list(
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<StoreReturnReasonsListRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/store/return-reasons',
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
   * GetReturnReasonsReason
   * Get a Return Reason
   * Retrieves a Return Reason.
   * @returns StoreReturnReasonsRes OK
   * @throws ApiError
   */
  public retrieve(
    id: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<StoreReturnReasonsRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/store/return-reasons/{id}',
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
