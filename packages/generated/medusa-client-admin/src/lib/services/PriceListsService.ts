/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import {
  AdminDeletePriceListPricesPricesReq,
  AdminGetPriceListPaginationParams,
  AdminGetPriceListsPriceListProductsParams,
  AdminPostPriceListPricesPricesReq,
  AdminPostPriceListsPriceListPriceListReq,
  AdminPostPriceListsPriceListReq,
  AdminPriceListDeleteBatchRes,
  AdminPriceListDeleteProductPricesRes,
  AdminPriceListDeleteRes,
  AdminPriceListDeleteVariantPricesRes,
  AdminPriceListRes,
  AdminPriceListsListRes,
  AdminPriceListsProductsListRes,
} from '@medusajs/client-types';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class PriceListsService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * GetPriceLists
   * List Price Lists
   * Retrieves a list of Price Lists.
   * @returns AdminPriceListsListRes OK
   * @throws ApiError
   */
  public list(
    queryParams: AdminGetPriceListPaginationParams,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminPriceListsListRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/admin/price-lists',
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
   * PostPriceListsPriceList
   * Create a Price List
   * Creates a Price List
   * @returns AdminPriceListRes OK
   * @throws ApiError
   */
  public create(
    requestBody: AdminPostPriceListsPriceListReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminPriceListRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/admin/price-lists',
      headers: customHeaders,
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
   * GetPriceListsPriceList
   * Get a Price List
   * Retrieves a Price List.
   * @returns AdminPriceListRes OK
   * @throws ApiError
   */
  public retrieve(
    id: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminPriceListRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/admin/price-lists/{id}',
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
   * PostPriceListsPriceListPriceList
   * Update a Price List
   * Updates a Price List
   * @returns AdminPriceListRes OK
   * @throws ApiError
   */
  public update(
    id: string,
    requestBody: AdminPostPriceListsPriceListPriceListReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminPriceListRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/admin/price-lists/{id}',
      path: {
        'id': id,
      },
      headers: customHeaders,
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
   * DeletePriceListsPriceList
   * Delete a Price List
   * Deletes a Price List
   * @returns AdminPriceListDeleteRes OK
   * @throws ApiError
   */
  public delete(
    id: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminPriceListDeleteRes> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/admin/price-lists/{id}',
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
   * PostPriceListsPriceListPricesBatch
   * Update Prices
   * Batch update prices for a Price List
   * @returns AdminPriceListRes OK
   * @throws ApiError
   */
  public addPrices(
    id: string,
    requestBody: AdminPostPriceListPricesPricesReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminPriceListRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/admin/price-lists/{id}/prices/batch',
      path: {
        'id': id,
      },
      headers: customHeaders,
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
   * DeletePriceListsPriceListPricesBatch
   * Delete Prices
   * Batch delete prices that belong to a Price List
   * @returns AdminPriceListDeleteBatchRes OK
   * @throws ApiError
   */
  public deletePrices(
    id: string,
    requestBody: AdminDeletePriceListPricesPricesReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminPriceListDeleteBatchRes> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/admin/price-lists/{id}/prices/batch',
      path: {
        'id': id,
      },
      headers: customHeaders,
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
   * GetPriceListsPriceListProducts
   * List Products
   * Retrieves a list of Product that are part of a Price List
   * @returns AdminPriceListsProductsListRes OK
   * @throws ApiError
   */
  public listProducts(
    id: string,
    queryParams: AdminGetPriceListsPriceListProductsParams,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminPriceListsProductsListRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/admin/price-lists/{id}/products',
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
   * DeletePriceListsPriceListProductsProductPrices
   * Delete Product's Prices
   * Delete all the prices related to a specific product in a price list
   * @returns AdminPriceListDeleteProductPricesRes OK
   * @throws ApiError
   */
  public deleteProductPrices(
    id: string,
    productId: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminPriceListDeleteProductPricesRes> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/admin/price-lists/{id}/products/{product_id}/prices',
      path: {
        'id': id,
        'product_id': productId,
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
   * DeletePriceListsPriceListVariantsVariantPrices
   * Delete Variant's Prices
   * Delete all the prices related to a specific variant in a price list
   * @returns AdminPriceListDeleteVariantPricesRes OK
   * @throws ApiError
   */
  public deleteVariantPrices(
    id: string,
    variantId: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminPriceListDeleteVariantPricesRes> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/admin/price-lists/{id}/variants/{variant_id}/prices',
      path: {
        'id': id,
        'variant_id': variantId,
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
