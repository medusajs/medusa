/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdminGetRegionsParams } from '../models/AdminGetRegionsParams';
import type { AdminGetRegionsRegionFulfillmentOptionsRes } from '../models/AdminGetRegionsRegionFulfillmentOptionsRes';
import type { AdminPostRegionsRegionCountriesReq } from '../models/AdminPostRegionsRegionCountriesReq';
import type { AdminPostRegionsRegionFulfillmentProvidersReq } from '../models/AdminPostRegionsRegionFulfillmentProvidersReq';
import type { AdminPostRegionsRegionPaymentProvidersReq } from '../models/AdminPostRegionsRegionPaymentProvidersReq';
import type { AdminPostRegionsRegionReq } from '../models/AdminPostRegionsRegionReq';
import type { AdminPostRegionsReq } from '../models/AdminPostRegionsReq';
import type { AdminRegionsDeleteRes } from '../models/AdminRegionsDeleteRes';
import type { AdminRegionsListRes } from '../models/AdminRegionsListRes';
import type { AdminRegionsRes } from '../models/AdminRegionsRes';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class RegionService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * GetRegions
   * List Regions
   * Retrieves a list of Regions.
   * @returns AdminRegionsListRes OK
   * @throws ApiError
   */
  public list(
    queryParams: AdminGetRegionsParams,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminRegionsListRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/regions',
      headers: customHeaders,
      query: {
        'limit': queryParams.limit,
        'offset': queryParams.offset,
        'created_at': queryParams.created_at,
        'updated_at': queryParams.updated_at,
        'deleted_at': queryParams.deleted_at,
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
   * PostRegions
   * Create a Region
   * Creates a Region
   * @returns AdminRegionsRes OK
   * @throws ApiError
   */
  public create(
    requestBody: AdminPostRegionsReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminRegionsRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/regions',
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
   * GetRegionsRegion
   * Get a Region
   * Retrieves a Region.
   * @returns AdminRegionsRes OK
   * @throws ApiError
   */
  public retrieve(
    id: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminRegionsRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/regions/{id}',
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
   * PostRegionsRegion
   * Update a Region
   * Updates a Region
   * @returns AdminRegionsRes OK
   * @throws ApiError
   */
  public update(
    id: string,
    requestBody: AdminPostRegionsRegionReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminRegionsRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/regions/{id}',
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
   * DeleteRegionsRegion
   * Delete a Region
   * Deletes a Region.
   * @returns AdminRegionsDeleteRes OK
   * @throws ApiError
   */
  public delete(
    id: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminRegionsDeleteRes> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/regions/{id}',
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
   * PostRegionsRegionCountries
   * Add Country
   * Adds a Country to the list of Countries in a Region
   * @returns AdminRegionsRes OK
   * @throws ApiError
   */
  public addCountry(
    id: string,
    requestBody: AdminPostRegionsRegionCountriesReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminRegionsRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/regions/{id}/countries',
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
   * PostRegionsRegionCountriesCountry
   * Delete Country
   * Removes a Country from the list of Countries in a Region
   * @returns AdminRegionsRes OK
   * @throws ApiError
   */
  public deleteCountry(
    id: string,
    countryCode: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminRegionsRes> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/regions/{id}/countries/{country_code}',
      path: {
        'id': id,
        'country_code': countryCode,
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
   * GetRegionsRegionFulfillmentOptions
   * List Fulfillment Options
   * Gathers all the fulfillment options available to in the Region.
   * @returns AdminGetRegionsRegionFulfillmentOptionsRes OK
   * @throws ApiError
   */
  public retrieveFulfillmentOptions(
    id: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminGetRegionsRegionFulfillmentOptionsRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/regions/{id}/fulfillment-options',
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
   * PostRegionsRegionFulfillmentProviders
   * Add Fulfillment Provider
   * Adds a Fulfillment Provider to a Region
   * @returns AdminRegionsRes OK
   * @throws ApiError
   */
  public addFulfillmentProvider(
    id: string,
    requestBody: AdminPostRegionsRegionFulfillmentProvidersReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminRegionsRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/regions/{id}/fulfillment-providers',
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
   * PostRegionsRegionFulfillmentProvidersProvider
   * Del. Fulfillment Provider
   * Removes a Fulfillment Provider.
   * @returns AdminRegionsRes OK
   * @throws ApiError
   */
  public deleteFulfillmentProvider(
    id: string,
    providerId: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminRegionsRes> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/regions/{id}/fulfillment-providers/{provider_id}',
      path: {
        'id': id,
        'provider_id': providerId,
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
   * PostRegionsRegionPaymentProviders
   * Add Payment Provider
   * Adds a Payment Provider to a Region
   * @returns AdminRegionsRes OK
   * @throws ApiError
   */
  public addPaymentProvider(
    id: string,
    requestBody: AdminPostRegionsRegionPaymentProvidersReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminRegionsRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/regions/{id}/payment-providers',
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
   * PostRegionsRegionPaymentProvidersProvider
   * Delete Payment Provider
   * Removes a Payment Provider.
   * @returns AdminRegionsRes OK
   * @throws ApiError
   */
  public deletePaymentProvider(
    id: string,
    providerId: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminRegionsRes> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/regions/{id}/payment-providers/{provider_id}',
      path: {
        'id': id,
        'provider_id': providerId,
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
