/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import {
  AdminGetProductTagsParams,
  AdminProductTagsListRes,
} from '@medusajs/client-types';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class ProductTagsService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * GetProductTags
   * List Product Tags
   * Retrieve a list of Product Tags.
   * @returns AdminProductTagsListRes OK
   * @throws ApiError
   */
  public list(
    queryParams: AdminGetProductTagsParams,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminProductTagsListRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/admin/product-tags',
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
