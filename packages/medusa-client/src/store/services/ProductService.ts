/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { StoreGetProductsParams } from '../models/StoreGetProductsParams';
import type { StorePostSearchReq } from '../models/StorePostSearchReq';
import type { StorePostSearchRes } from '../models/StorePostSearchRes';
import type { StoreProductsListRes } from '../models/StoreProductsListRes';
import type { StoreProductsRes } from '../models/StoreProductsRes';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class ProductService {

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
      url: '/products',
      headers: customHeaders,
      query: {
        'q': queryParams.q,
        'id': queryParams.id,
        'sales_channel_id': queryParams.salesChannelId,
        'collection_id': queryParams.collectionId,
        'type_id': queryParams.typeId,
        'tags': queryParams.tags,
        'title': queryParams.title,
        'description': queryParams.description,
        'handle': queryParams.handle,
        'is_giftcard': queryParams.isGiftcard,
        'created_at': queryParams.createdAt,
        'updated_at': queryParams.updatedAt,
        'offset': queryParams.offset,
        'limit': queryParams.limit,
        'expand': queryParams.expand,
        'fields': queryParams.fields,
        'order': queryParams.order,
        'cart_id': queryParams.cartId,
        'region_id': queryParams.regionId,
        'currency_code': queryParams.currencyCode,
      },
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
      url: '/products/search',
      headers: customHeaders,
      query: {
        'q': queryParams.q,
        'offset': queryParams.offset,
        'limit': queryParams.limit,
      },
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
    queryParams: {
      /**
       * The ID of the customer's cart.
       */
      cartId?: string,
      /**
       * The ID of the region the customer is using. This is helpful to ensure correct prices are retrieved for a region.
       */
      regionId?: string,
      /**
       * The 3 character ISO currency code to set prices based on. This is helpful to ensure correct prices are retrieved for a currency.
       */
      currencyCode?: string,
    },
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<StoreProductsRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/products/{id}',
      path: {
        'id': id,
      },
      headers: customHeaders,
      query: {
        'cart_id': queryParams.cartId,
        'region_id': queryParams.regionId,
        'currency_code': queryParams.currencyCode,
      },
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
