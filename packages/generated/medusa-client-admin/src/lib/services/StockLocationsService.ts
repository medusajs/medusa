/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import {
  AdminGetStockLocationsLocationParams,
  AdminGetStockLocationsParams,
  AdminPostStockLocationsLocationReq,
  AdminPostStockLocationsReq,
  AdminStockLocationsListRes,
  AdminStockLocationsRes,
} from '@medusajs/client-types';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class StockLocationsService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * GetStockLocations
   * List Stock Locations
   * Retrieves a list of stock locations
   * @returns AdminStockLocationsListRes OK
   * @throws ApiError
   */
  public list(
    queryParams: AdminGetStockLocationsParams,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminStockLocationsListRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/admin/stock-locations',
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
      url: '/admin/stock-locations',
      headers: customHeaders,
      query: queryParams,
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
    queryParams: AdminGetStockLocationsLocationParams,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminStockLocationsRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/admin/stock-locations/{id}',
      path: {
        'id': id,
      },
      headers: customHeaders,
      query: queryParams,
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
      url: '/admin/stock-locations/{id}',
      path: {
        'id': id,
      },
      headers: customHeaders,
      query: queryParams,
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
   * DeleteStockLocationsStockLocation
   * Delete a Stock Location
   * Delete a Stock Location
   * @returns any OK
   * @throws ApiError
   */
  public deleteStockLocationsStockLocation(
    id: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<{
    /**
     * The ID of the deleted Stock Location.
     */
    id?: string;
    /**
     * The type of the object that was deleted.
     */
    object?: string;
    /**
     * Whether or not the Stock Location was deleted.
     */
    deleted?: boolean;
  }> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/admin/stock-locations/{id}',
      path: {
        'id': id,
      },
      headers: customHeaders,
      errors: {
        400: `Client Error or Multiple Errors`,
      },
    });
  }

}
