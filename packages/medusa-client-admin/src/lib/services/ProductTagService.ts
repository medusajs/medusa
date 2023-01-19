/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdminGetProductTagsParams } from '../models/AdminGetProductTagsParams';
import type { AdminProductsListTagsRes } from '../models/AdminProductsListTagsRes';
import type { AdminProductTagsListRes } from '../models/AdminProductTagsListRes';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class ProductTagService {

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
      url: '/product-tags',
      headers: customHeaders,
      query: {
        'limit': queryParams.limit,
        'offset': queryParams.offset,
        'order': queryParams.order,
        'discount_condition_id': queryParams.discount_condition_id,
        'value': queryParams.value,
        'q': queryParams.q,
        'id': queryParams.id,
        'created_at': queryParams.created_at,
        'updated_at': queryParams.updated_at,
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
   * GetProductsTagUsage
   * List Tags Usage Number
   * Retrieves a list of Product Tags with how many times each is used.
   * @returns AdminProductsListTagsRes OK
   * @throws ApiError
   */
  public listTags(
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminProductsListTagsRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/products/tag-usage',
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
