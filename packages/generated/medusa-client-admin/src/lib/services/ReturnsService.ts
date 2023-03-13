/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import {
  AdminGetReturnsParams,
  AdminPostReturnsReturnReceiveReq,
  AdminReturnsCancelRes,
  AdminReturnsListRes,
  AdminReturnsRes,
} from '@medusajs/client-types';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class ReturnsService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * GetReturns
   * List Returns
   * Retrieves a list of Returns
   * @returns AdminReturnsListRes OK
   * @throws ApiError
   */
  public list(
    queryParams: AdminGetReturnsParams,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminReturnsListRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/admin/returns',
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
   * PostReturnsReturnCancel
   * Cancel a Return
   * Registers a Return as canceled.
   * @returns AdminReturnsCancelRes OK
   * @throws ApiError
   */
  public cancel(
    id: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminReturnsCancelRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/admin/returns/{id}/cancel',
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

  /**
   * PostReturnsReturnReceive
   * Receive a Return
   * Registers a Return as received. Updates statuses on Orders and Swaps accordingly.
   * @returns AdminReturnsRes OK
   * @throws ApiError
   */
  public receive(
    id: string,
    requestBody: AdminPostReturnsReturnReceiveReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminReturnsRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/admin/returns/{id}/receive',
      path: {
        'id': id,
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

}
