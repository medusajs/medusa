/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import {
  AdminExtendedStoresRes,
  AdminPaymentProvidersList,
  AdminPostStoreReq,
  AdminStoresRes,
  AdminTaxProvidersList,
} from '@medusajs/client-types';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class StoreService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * GetStore
   * Get Store details
   * Retrieves the Store details
   * @returns AdminExtendedStoresRes OK
   * @throws ApiError
   */
  public retrieve(
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminExtendedStoresRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/admin/store',
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
   * PostStore
   * Update Store Details
   * Updates the Store details
   * @returns AdminStoresRes OK
   * @throws ApiError
   */
  public update(
    requestBody: AdminPostStoreReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminStoresRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/admin/store',
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
   * PostStoreCurrenciesCode
   * Add a Currency Code
   * Adds a Currency Code to the available currencies.
   * @returns AdminStoresRes OK
   * @throws ApiError
   */
  public addCurrency(
    code: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminStoresRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/admin/store/currencies/{code}',
      path: {
        'code': code,
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
   * DeleteStoreCurrenciesCode
   * Delete a Currency Code
   * Removes a Currency Code from the available currencies.
   * @returns AdminStoresRes OK
   * @throws ApiError
   */
  public deleteCurrency(
    code: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminStoresRes> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/admin/store/currencies/{code}',
      path: {
        'code': code,
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
   * GetStorePaymentProviders
   * List Payment Providers
   * Retrieves the configured Payment Providers
   * @returns AdminPaymentProvidersList OK
   * @throws ApiError
   */
  public listPaymentProviders(
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminPaymentProvidersList> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/admin/store/payment-providers',
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
   * GetStoreTaxProviders
   * List Tax Providers
   * Retrieves the configured Tax Providers
   * @returns AdminTaxProvidersList OK
   * @throws ApiError
   */
  public listTaxProviders(
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminTaxProvidersList> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/admin/store/tax-providers',
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
