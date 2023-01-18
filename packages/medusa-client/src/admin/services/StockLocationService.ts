/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdminPostStockLocationsLocationReq } from '../models/AdminPostStockLocationsLocationReq';
import type { AdminPostStockLocationsReq } from '../models/AdminPostStockLocationsReq';
import type { AdminStockLocationsRes } from '../models/AdminStockLocationsRes';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class StockLocationService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * PostStockLocations
   * Create a Stock Location
   * Creates a Stock Location.
   * @returns AdminStockLocationsRes OK
   * @throws ApiError
   */
  public create(
    requestBody: AdminPostStockLocationsReq,
    queryParams: {
      /**
       * Comma separated list of relations to include in the results.
       */
      expand?: string,
      /**
       * Comma separated list of fields to include in the results.
       */
      fields?: string,
    },
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminStockLocationsRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/stock-locations',
      headers: customHeaders,
      query: {
        'expand': queryParams.expand,
        'fields': queryParams.fields,
      },
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
   * GetStockLocationsStockLocation
   * Get a Stock Location
   * Retrieves the Stock Location.
   * @returns AdminStockLocationsRes OK
   * @throws ApiError
   */
  public retrieve(
    id: string,
    queryParams: {
      /**
       * Comma separated list of relations to include in the results.
       */
      expand?: string,
      /**
       * Comma separated list of fields to include in the results.
       */
      fields?: string,
    },
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminStockLocationsRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/stock-locations/{id}',
      path: {
        'id': id,
      },
      headers: customHeaders,
      query: {
        'expand': queryParams.expand,
        'fields': queryParams.fields,
      },
    });
  }

  /**
   * PostStockLocationsStockLocation
   * Update a Stock Location
   * Updates a Stock Location.
   * @returns AdminStockLocationsRes OK
   * @throws ApiError
   */
  public update(
    id: string,
    requestBody: AdminPostStockLocationsLocationReq,
    queryParams: {
      /**
       * Comma separated list of relations to include in the results.
       */
      expand?: string,
      /**
       * Comma separated list of fields to include in the results.
       */
      fields?: string,
    },
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminStockLocationsRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/stock-locations/{id}',
      path: {
        'id': id,
      },
      headers: customHeaders,
      query: {
        'expand': queryParams.expand,
        'fields': queryParams.fields,
      },
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
