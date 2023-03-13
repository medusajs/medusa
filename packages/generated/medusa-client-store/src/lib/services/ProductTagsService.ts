/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import {
  StoreGetProductTagsParams,
  StoreProductTagsListRes,
} from '@medusajs/client-types';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class ProductTagsService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * GetProductTags
   * List Product Tags
   * Retrieve a list of Product Tags.
   * @returns StoreProductTagsListRes OK
   * @throws ApiError
   */
  public list(
    queryParams: StoreGetProductTagsParams,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<StoreProductTagsListRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/store/product-tags',
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

}
