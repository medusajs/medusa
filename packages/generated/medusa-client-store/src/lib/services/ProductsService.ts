/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import {
  StoreGetProductsParams,
  StoreGetProductsProductParams,
  StorePostSearchReq,
  StorePostSearchRes,
  StoreProductsListRes,
  StoreProductsRes,
} from '@medusajs/client-types';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class ProductsService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * GetProducts
   * List Products
   * Retrieves a list of Products.
   * @returns StoreProductsListRes OK
   * @throws ApiError
   */
  public list(
    queryParams: StoreGetProductsParams,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<StoreProductsListRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/store/products',
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
   * PostProductsSearch
   * Search Products
   * Run a search query on products using the search engine installed on Medusa
   * @returns StorePostSearchRes OK
   * @throws ApiError
   */
  public search(
    queryParams: StorePostSearchReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<StorePostSearchRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/store/products/search',
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
   * GetProductsProduct
   * Get a Product
   * Retrieves a Product.
   * @returns StoreProductsRes OK
   * @throws ApiError
   */
  public retrieve(
    id: string,
    queryParams: StoreGetProductsProductParams,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<StoreProductsRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/store/products/{id}',
      path: {
        'id': id,
      },
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

}
