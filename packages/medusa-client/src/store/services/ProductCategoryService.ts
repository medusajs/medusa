/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProductCategory } from '../models/ProductCategory';
import type { StoreGetProductCategoriesParams } from '../models/StoreGetProductCategoriesParams';
import type { StoreGetProductCategoryParams } from '../models/StoreGetProductCategoryParams';
import type { StoreGetProductCategoryRes } from '../models/StoreGetProductCategoryRes';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class ProductCategoryService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * GetProductCategories
   * List Product Categories
   * Retrieve a list of product categories.
   * @returns any OK
   * @throws ApiError
   */
  public list(
    queryParams: StoreGetProductCategoriesParams,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<{
    product_categories?: Array<ProductCategory>;
    /**
     * The total number of items available
     */
    count?: number;
    /**
     * The number of items skipped before these items
     */
    offset?: number;
    /**
     * The number of items per page
     */
    limit?: number;
  }> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/product-categories',
      headers: customHeaders,
      query: {
        'q': queryParams.q,
        'parent_category_id': queryParams.parentCategoryId,
        'offset': queryParams.offset,
        'limit': queryParams.limit,
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
   * GetProductCategoriesCategory
   * Get a Product Category
   * Retrieves a Product Category.
   * @returns StoreGetProductCategoryRes OK
   * @throws ApiError
   */
  public retrieve(
    id: string,
    queryParams: StoreGetProductCategoryParams,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<StoreGetProductCategoryRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/product-categories/{id}',
      path: {
        'id': id,
      },
      headers: customHeaders,
      query: {
        'expand': queryParams.expand,
        'fields': queryParams.fields,
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

}
