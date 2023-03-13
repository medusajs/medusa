/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import {
  AdminGetProductsParams,
  AdminGetProductsVariantsParams,
  AdminGetVariantParams,
  AdminPostProductsProductMetadataReq,
  AdminPostProductsProductOptionsOption,
  AdminPostProductsProductOptionsReq,
  AdminPostProductsProductReq,
  AdminPostProductsProductVariantsReq,
  AdminPostProductsProductVariantsVariantReq,
  AdminPostProductsReq,
  AdminProductsDeleteOptionRes,
  AdminProductsDeleteRes,
  AdminProductsDeleteVariantRes,
  AdminProductsListRes,
  AdminProductsListTagsRes,
  AdminProductsListTypesRes,
  AdminProductsListVariantsRes,
  AdminProductsRes,
  AdminVariantsRes,
} from '@medusajs/client-types';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class ProductsService {

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
      url: '/admin/products',
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
      url: '/admin/products',
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
      url: '/admin/products/tag-usage',
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
      url: '/admin/products/types',
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
      url: '/admin/products/{id}',
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
      url: '/admin/products/{id}',
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
      url: '/admin/products/{id}',
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
      url: '/admin/products/{id}/metadata',
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
      url: '/admin/products/{id}/options',
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
      url: '/admin/products/{id}/options/{option_id}',
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
      url: '/admin/products/{id}/options/{option_id}',
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
      url: '/admin/products/{id}/variants',
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
      url: '/admin/products/{id}/variants',
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
      url: '/admin/products/{id}/variants/{variant_id}',
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
      url: '/admin/products/{id}/variants/{variant_id}',
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

  /**
   * GetVariantsVariant
   * Get a Product variant
   * Retrieves a Product variant.
   * @returns AdminVariantsRes OK
   * @throws ApiError
   */
  public retrieve1(
    id: string,
    queryParams: AdminGetVariantParams,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminVariantsRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/admin/variants/{id}',
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
