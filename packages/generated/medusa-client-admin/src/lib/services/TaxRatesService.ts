/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import {
  AdminDeleteTaxRatesTaxRateProductsParams,
  AdminDeleteTaxRatesTaxRateProductsReq,
  AdminDeleteTaxRatesTaxRateProductTypesParams,
  AdminDeleteTaxRatesTaxRateProductTypesReq,
  AdminDeleteTaxRatesTaxRateShippingOptionsParams,
  AdminDeleteTaxRatesTaxRateShippingOptionsReq,
  AdminGetTaxRatesParams,
  AdminGetTaxRatesTaxRateParams,
  AdminPostTaxRatesParams,
  AdminPostTaxRatesReq,
  AdminPostTaxRatesTaxRateParams,
  AdminPostTaxRatesTaxRateProductsParams,
  AdminPostTaxRatesTaxRateProductsReq,
  AdminPostTaxRatesTaxRateProductTypesParams,
  AdminPostTaxRatesTaxRateProductTypesReq,
  AdminPostTaxRatesTaxRateReq,
  AdminPostTaxRatesTaxRateShippingOptionsParams,
  AdminPostTaxRatesTaxRateShippingOptionsReq,
  AdminTaxRatesDeleteRes,
  AdminTaxRatesListRes,
  AdminTaxRatesRes,
} from '@medusajs/client-types';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class TaxRatesService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * GetTaxRates
   * List Tax Rates
   * Retrieves a list of TaxRates
   * @returns AdminTaxRatesListRes OK
   * @throws ApiError
   */
  public list(
    queryParams: AdminGetTaxRatesParams,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminTaxRatesListRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/admin/tax-rates',
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
   * PostTaxRates
   * Create a Tax Rate
   * Creates a Tax Rate
   * @returns AdminTaxRatesRes OK
   * @throws ApiError
   */
  public create(
    requestBody: AdminPostTaxRatesReq,
    queryParams: AdminPostTaxRatesParams,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminTaxRatesRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/admin/tax-rates',
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
   * GetTaxRatesTaxRate
   * Get a Tax Rate
   * Retrieves a TaxRate
   * @returns AdminTaxRatesRes OK
   * @throws ApiError
   */
  public retrieve(
    id: string,
    queryParams: AdminGetTaxRatesTaxRateParams,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminTaxRatesRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/admin/tax-rates/{id}',
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
   * PostTaxRatesTaxRate
   * Update a Tax Rate
   * Updates a Tax Rate
   * @returns AdminTaxRatesRes OK
   * @throws ApiError
   */
  public update(
    id: string,
    requestBody: AdminPostTaxRatesTaxRateReq,
    queryParams: AdminPostTaxRatesTaxRateParams,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminTaxRatesRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/admin/tax-rates/{id}',
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
   * DeleteTaxRatesTaxRate
   * Delete a Tax Rate
   * Deletes a Tax Rate
   * @returns AdminTaxRatesDeleteRes OK
   * @throws ApiError
   */
  public delete(
    id: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminTaxRatesDeleteRes> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/admin/tax-rates/{id}',
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
   * PostTaxRatesTaxRateProductTypes
   * Add to Product Types
   * Associates a Tax Rate with a list of Product Types
   * @returns AdminTaxRatesRes OK
   * @throws ApiError
   */
  public addProductTypes(
    id: string,
    requestBody: AdminPostTaxRatesTaxRateProductTypesReq,
    queryParams: AdminPostTaxRatesTaxRateProductTypesParams,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminTaxRatesRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/admin/tax-rates/{id}/product-types/batch',
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
   * DeleteTaxRatesTaxRateProductTypes
   * Delete from Product Types
   * Removes a Tax Rate from a list of Product Types
   * @returns AdminTaxRatesRes OK
   * @throws ApiError
   */
  public removeProductTypes(
    id: string,
    requestBody: AdminDeleteTaxRatesTaxRateProductTypesReq,
    queryParams: AdminDeleteTaxRatesTaxRateProductTypesParams,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminTaxRatesRes> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/admin/tax-rates/{id}/product-types/batch',
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
   * PostTaxRatesTaxRateProducts
   * Add to Products
   * Associates a Tax Rate with a list of Products
   * @returns AdminTaxRatesRes OK
   * @throws ApiError
   */
  public addProducts(
    id: string,
    requestBody: AdminPostTaxRatesTaxRateProductsReq,
    queryParams: AdminPostTaxRatesTaxRateProductsParams,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminTaxRatesRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/admin/tax-rates/{id}/products/batch',
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
   * DeleteTaxRatesTaxRateProducts
   * Delete from Products
   * Removes a Tax Rate from a list of Products
   * @returns AdminTaxRatesRes OK
   * @throws ApiError
   */
  public removeProducts(
    id: string,
    requestBody: AdminDeleteTaxRatesTaxRateProductsReq,
    queryParams: AdminDeleteTaxRatesTaxRateProductsParams,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminTaxRatesRes> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/admin/tax-rates/{id}/products/batch',
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
   * PostTaxRatesTaxRateShippingOptions
   * Add to Shipping Options
   * Associates a Tax Rate with a list of Shipping Options
   * @returns AdminTaxRatesRes OK
   * @throws ApiError
   */
  public addShippingOptions(
    id: string,
    requestBody: AdminPostTaxRatesTaxRateShippingOptionsReq,
    queryParams: AdminPostTaxRatesTaxRateShippingOptionsParams,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminTaxRatesRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/admin/tax-rates/{id}/shipping-options/batch',
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
   * DeleteTaxRatesTaxRateShippingOptions
   * Del. for Shipping Options
   * Removes a Tax Rate from a list of Shipping Options
   * @returns AdminTaxRatesRes OK
   * @throws ApiError
   */
  public removeShippingOptions(
    id: string,
    requestBody: AdminDeleteTaxRatesTaxRateShippingOptionsReq,
    queryParams: AdminDeleteTaxRatesTaxRateShippingOptionsParams,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminTaxRatesRes> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/admin/tax-rates/{id}/shipping-options/batch',
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
