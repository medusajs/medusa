/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import {
  StoreGetRegionsParams,
  StoreRegionsListRes,
  StoreRegionsRes,
} from '@medusajs/client-types';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class RegionsService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * GetRegions
   * List Regions
   * Retrieves a list of Regions.
   * @returns StoreRegionsListRes OK
   * @throws ApiError
   */
  public list(
    queryParams: StoreGetRegionsParams,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<StoreRegionsListRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/store/regions',
      headers: customHeaders,
      query: queryParams,
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
   * GetRegionsRegion
   * Get a Region
   * Retrieves a Region.
   * @returns StoreRegionsRes OK
   * @throws ApiError
   */
  public retrieve(
    id: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<StoreRegionsRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/store/regions/{id}',
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
