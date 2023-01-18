/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdminGetProductsParams } from '../models/AdminGetProductsParams';
import type { AdminGetProductsVariantsParams } from '../models/AdminGetProductsVariantsParams';
import type { AdminPostProductsProductMetadataReq } from '../models/AdminPostProductsProductMetadataReq';
import type { AdminPostProductsProductOptionsOption } from '../models/AdminPostProductsProductOptionsOption';
import type { AdminPostProductsProductOptionsReq } from '../models/AdminPostProductsProductOptionsReq';
import type { AdminPostProductsProductReq } from '../models/AdminPostProductsProductReq';
import type { AdminPostProductsProductVariantsReq } from '../models/AdminPostProductsProductVariantsReq';
import type { AdminPostProductsProductVariantsVariantReq } from '../models/AdminPostProductsProductVariantsVariantReq';
import type { AdminPostProductsReq } from '../models/AdminPostProductsReq';
import type { AdminProductsDeleteOptionRes } from '../models/AdminProductsDeleteOptionRes';
import type { AdminProductsDeleteRes } from '../models/AdminProductsDeleteRes';
import type { AdminProductsDeleteVariantRes } from '../models/AdminProductsDeleteVariantRes';
import type { AdminProductsListRes } from '../models/AdminProductsListRes';
import type { AdminProductsListTypesRes } from '../models/AdminProductsListTypesRes';
import type { AdminProductsListVariantsRes } from '../models/AdminProductsListVariantsRes';
import type { AdminProductsRes } from '../models/AdminProductsRes';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class ProductService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * GetProducts
   * List Products
   * Retrieves a list of Product
   * @returns AdminProductsListRes OK
   * @throws ApiError
   */
  public list(
    queryParams: AdminGetProductsParams,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminProductsListRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/products',
      headers: customHeaders,
      query: {
        'q': queryParams.q,
        'discount_condition_id': queryParams.discountConditionId,
        'id': queryParams.id,
        'status': queryParams.status,
        'collection_id': queryParams.collectionId,
        'tags': queryParams.tags,
        'price_list_id': queryParams.priceListId,
        'sales_channel_id': queryParams.salesChannelId,
        'type_id': queryParams.typeId,
        'title': queryParams.title,
        'description': queryParams.description,
        'handle': queryParams.handle,
        'is_giftcard': queryParams.isGiftcard,
        'created_at': queryParams.createdAt,
        'updated_at': queryParams.updatedAt,
        'deleted_at': queryParams.deletedAt,
        'offset': queryParams.offset,
        'limit': queryParams.limit,
        'expand': queryParams.expand,
        'fields': queryParams.fields,
        'order': queryParams.order,
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
   * PostProducts
   * Create a Product
   * Creates a Product
   * @returns AdminProductsRes OK
   * @throws ApiError
   */
  public create(
    requestBody: AdminPostProductsReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminProductsRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/products',
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
   * @deprecated
   * GetProductsTypes
   * List Product Types
   * Retrieves a list of Product Types.
   * @returns AdminProductsListTypesRes OK
   * @throws ApiError
   */
  public listTypes(
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminProductsListTypesRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/products/types',
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
   * GetProductsProduct
   * Get a Product
   * Retrieves a Product.
   * @returns AdminProductsRes OK
   * @throws ApiError
   */
  public retrieve(
    id: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminProductsRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/products/{id}',
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
   * PostProductsProduct
   * Update a Product
   * Updates a Product
   * @returns AdminProductsRes OK
   * @throws ApiError
   */
  public update(
    id: string,
    requestBody: AdminPostProductsProductReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminProductsRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/products/{id}',
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
   * DeleteProductsProduct
   * Delete a Product
   * Deletes a Product and it's associated Product Variants.
   * @returns AdminProductsDeleteRes OK
   * @throws ApiError
   */
  public delete(
    id: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminProductsDeleteRes> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/products/{id}',
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
   * PostProductsProductMetadata
   * Set Product Metadata
   * Set metadata key/value pair for Product
   * @returns AdminProductsRes OK
   * @throws ApiError
   */
  public setMetadata(
    id: string,
    requestBody: AdminPostProductsProductMetadataReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminProductsRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/products/{id}/metadata',
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
   * PostProductsProductOptions
   * Add an Option
   * Adds a Product Option to a Product
   * @returns AdminProductsRes OK
   * @throws ApiError
   */
  public addOption(
    id: string,
    requestBody: AdminPostProductsProductOptionsReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminProductsRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/products/{id}/options',
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
   * PostProductsProductOptionsOption
   * Update a Product Option
   * Updates a Product Option
   * @returns AdminProductsRes OK
   * @throws ApiError
   */
  public updateOption(
    id: string,
    optionId: string,
    requestBody: AdminPostProductsProductOptionsOption,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminProductsRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/products/{id}/options/{option_id}',
      path: {
        'id': id,
        'option_id': optionId,
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
   * DeleteProductsProductOptionsOption
   * Delete a Product Option
   * Deletes a Product Option. Before a Product Option can be deleted all Option Values for the Product Option must be the same. You may, for example, have to delete some of your variants prior to deleting the Product Option
   * @returns AdminProductsDeleteOptionRes OK
   * @throws ApiError
   */
  public deleteOption(
    id: string,
    optionId: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminProductsDeleteOptionRes> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/products/{id}/options/{option_id}',
      path: {
        'id': id,
        'option_id': optionId,
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
   * GetProductsProductVariants
   * List a Product's Variants
   * Retrieves a list of the Product Variants associated with a Product.
   * @returns AdminProductsListVariantsRes OK
   * @throws ApiError
   */
  public listVariants(
    id: string,
    queryParams: AdminGetProductsVariantsParams,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminProductsListVariantsRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/products/{id}/variants',
      path: {
        'id': id,
      },
      headers: customHeaders,
      query: {
        'fields': queryParams.fields,
        'expand': queryParams.expand,
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
   * PostProductsProductVariants
   * Create a Product Variant
   * Creates a Product Variant. Each Product Variant must have a unique combination of Product Option Values.
   * @returns AdminProductsRes OK
   * @throws ApiError
   */
  public createVariant(
    id: string,
    requestBody: AdminPostProductsProductVariantsReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminProductsRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/products/{id}/variants',
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
   * PostProductsProductVariantsVariant
   * Update a Product Variant
   * Update a Product Variant.
   * @returns AdminProductsRes OK
   * @throws ApiError
   */
  public updateVariant(
    id: string,
    variantId: string,
    requestBody: AdminPostProductsProductVariantsVariantReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminProductsRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/products/{id}/variants/{variant_id}',
      path: {
        'id': id,
        'variant_id': variantId,
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
   * DeleteProductsProductVariantsVariant
   * Delete a Product Variant
   * Deletes a Product Variant.
   * @returns AdminProductsDeleteVariantRes OK
   * @throws ApiError
   */
  public deleteVariant(
    id: string,
    variantId: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminProductsDeleteVariantRes> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/products/{id}/variants/{variant_id}',
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
