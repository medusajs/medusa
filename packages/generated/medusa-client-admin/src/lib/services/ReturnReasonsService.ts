/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import {
  AdminPostReturnReasonsReasonReq,
  AdminPostReturnReasonsReq,
  AdminReturnReasonsDeleteRes,
  AdminReturnReasonsListRes,
  AdminReturnReasonsRes,
} from '@medusajs/client-types';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class ReturnReasonsService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * GetReturnReasons
   * List Return Reasons
   * Retrieves a list of Return Reasons.
   * @returns AdminReturnReasonsListRes OK
   * @throws ApiError
   */
  public list(
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminReturnReasonsListRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/admin/return-reasons',
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
   * PostReturnReasons
   * Create a Return Reason
   * Creates a Return Reason
   * @returns AdminReturnReasonsRes OK
   * @throws ApiError
   */
  public create(
    requestBody: AdminPostReturnReasonsReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminReturnReasonsRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/admin/return-reasons',
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
   * GetReturnReasonsReason
   * Get a Return Reason
   * Retrieves a Return Reason.
   * @returns AdminReturnReasonsRes OK
   * @throws ApiError
   */
  public retrieve(
    id: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminReturnReasonsRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/admin/return-reasons/{id}',
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
   * PostReturnReasonsReason
   * Update a Return Reason
   * Updates a Return Reason
   * @returns AdminReturnReasonsRes OK
   * @throws ApiError
   */
  public update(
    id: string,
    requestBody: AdminPostReturnReasonsReasonReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminReturnReasonsRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/admin/return-reasons/{id}',
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

  /**
   * DeleteReturnReason
   * Delete a Return Reason
   * Deletes a return reason.
   * @returns AdminReturnReasonsDeleteRes OK
   * @throws ApiError
   */
  public delete(
    id: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminReturnReasonsDeleteRes> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/admin/return-reasons/{id}',
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
