/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { StoreOrderEditsRes } from '../models/StoreOrderEditsRes';
import type { StorePostOrderEditsOrderEditDecline } from '../models/StorePostOrderEditsOrderEditDecline';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class OrderEditService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * GetOrderEditsOrderEdit
   * Retrieve an OrderEdit
   * Retrieves a OrderEdit.
   * @returns StoreOrderEditsRes OK
   * @throws ApiError
   */
  public retrieve(
    id: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<StoreOrderEditsRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/order-edits/{id}',
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
   * PostOrderEditsOrderEditComplete
   * Completes an OrderEdit
   * Completes an OrderEdit.
   * @returns StoreOrderEditsRes OK
   * @throws ApiError
   */
  public complete(
    id: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<StoreOrderEditsRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/order-edits/{id}/complete',
      path: {
        'id': id,
      },
      headers: customHeaders,
      errors: {
        400: `Client Error or Multiple Errors`,
        401: `User is not authorized. Must log in first`,
        404: `Not Found Error`,
        500: `Server Error`,
      },
    });
  }

  /**
   * PostOrderEditsOrderEditDecline
   * Decline an OrderEdit
   * Declines an OrderEdit.
   * @returns StoreOrderEditsRes OK
   * @throws ApiError
   */
  public decline(
    id: string,
    requestBody: StorePostOrderEditsOrderEditDecline,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<StoreOrderEditsRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/order-edits/{id}/decline',
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
        500: `Server Error`,
      },
    });
  }

}
