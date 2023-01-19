/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { StoreCollectionsListRes } from '../models/StoreCollectionsListRes';
import type { StoreCollectionsRes } from '../models/StoreCollectionsRes';
import type { StoreGetCollectionsParams } from '../models/StoreGetCollectionsParams';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class CollectionService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * GetCollections
   * List Collections
   * Retrieve a list of Product Collection.
   * @returns StoreCollectionsListRes OK
   * @throws ApiError
   */
  public list(
    queryParams: StoreGetCollectionsParams,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<StoreCollectionsListRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/collections',
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
   * GetCollectionsCollection
   * Get a Collection
   * Retrieves a Product Collection.
   * @returns StoreCollectionsRes OK
   * @throws ApiError
   */
  public retrieve(
    id: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<StoreCollectionsRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/collections/{id}',
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
