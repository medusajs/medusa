/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import {
  AdminGetSwapsParams,
  AdminSwapsListRes,
  AdminSwapsRes,
} from '@medusajs/client-types';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class SwapsService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * GetSwaps
   * List Swaps
   * Retrieves a list of Swaps.
   * @returns AdminSwapsListRes OK
   * @throws ApiError
   */
  public list(
    queryParams: AdminGetSwapsParams,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminSwapsListRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/admin/swaps',
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
   * GetSwapsSwap
   * Get a Swap
   * Retrieves a Swap.
   * @returns AdminSwapsRes OK
   * @throws ApiError
   */
  public retrieve(
    id: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminSwapsRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/admin/swaps/{id}',
      path: {
        'id': id,
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

}
