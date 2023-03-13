/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import {
  StoreGetProductCategoriesCategoryParams,
  StoreGetProductCategoriesCategoryRes,
  StoreGetProductCategoriesParams,
  StoreGetProductCategoriesRes,
} from '@medusajs/client-types';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class ProductCategoriesService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * GetProductCategories
   * List Product Categories
   * Retrieve a list of product categories.
   * @returns StoreGetProductCategoriesRes OK
   * @throws ApiError
   */
  public list(
    queryParams: StoreGetProductCategoriesParams,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<StoreGetProductCategoriesRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/store/product-categories',
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
   * GetProductCategoriesCategory
   * Get a Product Category
   * Retrieves a Product Category.
   * @returns StoreGetProductCategoriesCategoryRes OK
   * @throws ApiError
   */
  public retrieve(
    id: string,
    queryParams: StoreGetProductCategoriesCategoryParams,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<StoreGetProductCategoriesCategoryRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/store/product-categories/{id}',
      path: {
        'id': id,
      },
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
