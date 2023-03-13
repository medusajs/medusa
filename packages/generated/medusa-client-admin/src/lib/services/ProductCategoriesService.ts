/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import {
  AdminDeleteProductCategoriesCategoryProductsBatchParams,
  AdminDeleteProductCategoriesCategoryProductsBatchReq,
  AdminGetProductCategoriesParams,
  AdminGetProductCategoryParams,
  AdminPostProductCategoriesCategoryParams,
  AdminPostProductCategoriesCategoryProductsBatchParams,
  AdminPostProductCategoriesCategoryProductsBatchReq,
  AdminPostProductCategoriesCategoryReq,
  AdminPostProductCategoriesParams,
  AdminPostProductCategoriesReq,
  AdminProductCategoriesCategoryDeleteRes,
  AdminProductCategoriesCategoryRes,
  AdminProductCategoriesListRes,
} from '@medusajs/client-types';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class ProductCategoriesService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * GetProductCategories
   * List Product Categories
   * Retrieve a list of product categories.
   * @returns AdminProductCategoriesListRes OK
   * @throws ApiError
   */
  public list(
    queryParams: AdminGetProductCategoriesParams,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminProductCategoriesListRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/admin/product-categories',
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
   * PostProductCategories
   * Create a Product Category
   * Creates a Product Category.
   * @returns AdminProductCategoriesCategoryRes OK
   * @throws ApiError
   */
  public create(
    requestBody: AdminPostProductCategoriesReq,
    queryParams: AdminPostProductCategoriesParams,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminProductCategoriesCategoryRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/admin/product-categories',
      headers: customHeaders,
      query: queryParams,
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
   * @returns AdminProductCategoriesCategoryRes OK
   * @throws ApiError
   */
  public retrieve(
    id: string,
    queryParams: AdminGetProductCategoryParams,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminProductCategoriesCategoryRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/admin/product-categories/{id}',
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

  /**
   * PostProductCategoriesCategory
   * Update a Product Category
   * Updates a Product Category.
   * @returns AdminProductCategoriesCategoryRes OK
   * @throws ApiError
   */
  public update(
    id: string,
    requestBody: AdminPostProductCategoriesCategoryReq,
    queryParams: AdminPostProductCategoriesCategoryParams,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminProductCategoriesCategoryRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/admin/product-categories/{id}',
      path: {
        'id': id,
      },
      headers: customHeaders,
      query: queryParams,
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
   * @returns AdminProductCategoriesCategoryDeleteRes OK
   * @throws ApiError
   */
  public delete(
    id: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminProductCategoriesCategoryDeleteRes> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/admin/product-categories/{id}',
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

  /**
   * PostProductCategoriesCategoryProductsBatch
   * Add Products to a category
   * Assign a batch of products to a product category.
   * @returns AdminProductCategoriesCategoryRes OK
   * @throws ApiError
   */
  public addProducts(
    id: string,
    requestBody: AdminPostProductCategoriesCategoryProductsBatchReq,
    queryParams: AdminPostProductCategoriesCategoryProductsBatchParams,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminProductCategoriesCategoryRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/admin/product-categories/{id}/products/batch',
      path: {
        'id': id,
      },
      headers: customHeaders,
      query: queryParams,
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
   * DeleteProductCategoriesCategoryProductsBatch
   * Delete Products
   * Remove a list of products from a product category.
   * @returns AdminProductCategoriesCategoryRes OK
   * @throws ApiError
   */
  public removeProducts(
    id: string,
    requestBody: AdminDeleteProductCategoriesCategoryProductsBatchReq,
    queryParams: AdminDeleteProductCategoriesCategoryProductsBatchParams,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminProductCategoriesCategoryRes> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/admin/product-categories/{id}/products/batch',
      path: {
        'id': id,
      },
      headers: customHeaders,
      query: queryParams,
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

}
