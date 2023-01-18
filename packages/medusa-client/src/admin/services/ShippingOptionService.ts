/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdminGetShippingOptionsParams } from '../models/AdminGetShippingOptionsParams';
import type { AdminPostShippingOptionsOptionReq } from '../models/AdminPostShippingOptionsOptionReq';
import type { AdminPostShippingOptionsReq } from '../models/AdminPostShippingOptionsReq';
import type { AdminShippingOptionsDeleteRes } from '../models/AdminShippingOptionsDeleteRes';
import type { AdminShippingOptionsListRes } from '../models/AdminShippingOptionsListRes';
import type { AdminShippingOptionsRes } from '../models/AdminShippingOptionsRes';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class ShippingOptionService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * GetShippingOptions
   * List Shipping Options
   * Retrieves a list of Shipping Options.
   * @returns AdminShippingOptionsListRes OK
   * @throws ApiError
   */
  public list(
    queryParams: AdminGetShippingOptionsParams,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminShippingOptionsListRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/shipping-options',
      headers: customHeaders,
      query: {
        'region_id': queryParams.regionId,
        'is_return': queryParams.isReturn,
        'admin_only': queryParams.adminOnly,
      },
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
   * PostShippingOptions
   * Create Shipping Option
   * Creates a Shipping Option
   * @returns AdminShippingOptionsRes OK
   * @throws ApiError
   */
  public create(
    requestBody: AdminPostShippingOptionsReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminShippingOptionsRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/shipping-options',
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
   * GetShippingOptionsOption
   * Get a Shipping Option
   * Retrieves a Shipping Option.
   * @returns AdminShippingOptionsRes OK
   * @throws ApiError
   */
  public retrieve(
    id: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminShippingOptionsRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/shipping-options/{id}',
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
   * PostShippingOptionsOption
   * Update Shipping Option
   * Updates a Shipping Option
   * @returns AdminShippingOptionsRes OK
   * @throws ApiError
   */
  public update(
    id: string,
    requestBody: AdminPostShippingOptionsOptionReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminShippingOptionsRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/shipping-options/{id}',
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
   * DeleteShippingOptionsOption
   * Delete a Shipping Option
   * Deletes a Shipping Option.
   * @returns AdminShippingOptionsDeleteRes OK
   * @throws ApiError
   */
  public delete(
    id: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminShippingOptionsDeleteRes> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/shipping-options/{id}',
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
