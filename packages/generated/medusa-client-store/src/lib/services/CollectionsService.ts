/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import {
  StoreCollectionsListRes,
  StoreCollectionsRes,
  StoreGetCollectionsParams,
} from '@medusajs/client-types';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class CollectionsService {

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
      url: '/store/collections',
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
      url: '/store/collections/{id}',
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
