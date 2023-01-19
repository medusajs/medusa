/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdminGetProductCategoriesParams } from '../models/AdminGetProductCategoriesParams';
import type { AdminGetProductCategoryParams } from '../models/AdminGetProductCategoryParams';
import type { AdminPostProductCategoriesCategoryParams } from '../models/AdminPostProductCategoriesCategoryParams';
import type { AdminPostProductCategoriesCategoryReq } from '../models/AdminPostProductCategoriesCategoryReq';
import type { AdminPostProductCategoriesReq } from '../models/AdminPostProductCategoriesReq';
import type { ProductCategory } from '../models/ProductCategory';

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
    queryParams: AdminGetProductCategoriesParams,
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
        'is_internal': queryParams.is_internal,
        'is_active': queryParams.is_active,
        'parent_category_id': queryParams.parent_category_id,
        'offset': queryParams.offset,
        'limit': queryParams.limit,
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

  /**
   * PostProductCategories
   * Create a Product Category
   * Creates a Product Category.
   * @returns any OK
   * @throws ApiError
   */
  public create(
    requestBody: AdminPostProductCategoriesReq,
    queryParams: {
      /**
       * (Comma separated) Which fields should be expanded in the results.
       */
      expand?: string,
      /**
       * (Comma separated) Which fields should be retrieved in the results.
       */
      fields?: string,
    },
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<{
    product_category?: ProductCategory;
  }> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/product-categories',
      headers: customHeaders,
      query: {
        'expand': queryParams.expand,
        'fields': queryParams.fields,
      },
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
   * GetProductCategoriesCategory
   * Get a Product Category
   * Retrieves a Product Category.
   * @returns any OK
   * @throws ApiError
   */
  public retrieve(
    id: string,
    queryParams: AdminGetProductCategoryParams,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<{
    product_category?: ProductCategory;
  }> {
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

  /**
   * PostProductCategoriesCategory
   * Update a Product Category
   * Updates a Product Category.
   * @returns any OK
   * @throws ApiError
   */
  public update(
    id: string,
    requestBody: AdminPostProductCategoriesCategoryReq,
    queryParams: AdminPostProductCategoriesCategoryParams,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<{
    product_category?: ProductCategory;
  }> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/product-categories/{id}',
      path: {
        'id': id,
      },
      headers: customHeaders,
      query: {
        'expand': queryParams.expand,
        'fields': queryParams.fields,
      },
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
   * DeleteProductCategoriesCategory
   * Delete a Product Category
   * Deletes a ProductCategory.
   * @returns any OK
   * @throws ApiError
   */
  public delete(
    id: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<{
    /**
     * The ID of the deleted product category.
     */
    id?: string;
    /**
     * The type of the object that was deleted.
     */
    object?: string;
    /**
     * Whether the product category was deleted successfully or not.
     */
    deleted?: boolean;
  }> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/product-categories/{id}',
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

}
