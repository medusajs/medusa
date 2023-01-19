/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { StoreGetRegionsParams } from '../models/StoreGetRegionsParams';
import type { StoreRegionsListRes } from '../models/StoreRegionsListRes';
import type { StoreRegionsRes } from '../models/StoreRegionsRes';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class RegionService {

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
      url: '/regions',
      headers: customHeaders,
      query: {
        'offset': queryParams.offset,
        'limit': queryParams.limit,
        'created_at': queryParams.created_at,
        'updated_at': queryParams.updated_at,
      },
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
      url: '/regions/{id}',
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
