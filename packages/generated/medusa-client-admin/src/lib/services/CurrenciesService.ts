/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import {
  AdminCurrenciesListRes,
  AdminCurrenciesRes,
  AdminGetCurrenciesParams,
  AdminPostCurrenciesCurrencyReq,
} from '@medusajs/client-types';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class CurrenciesService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * GetCurrencies
   * List Currency
   * Retrieves a list of Currency
   * @returns AdminCurrenciesListRes OK
   * @throws ApiError
   */
  public list(
    queryParams: AdminGetCurrenciesParams,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminCurrenciesListRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/admin/currencies',
      headers: customHeaders,
      query: queryParams,
    });
  }

  /**
   * PostCurrenciesCurrency
   * Update a Currency
   * Update a Currency
   * @returns AdminCurrenciesRes OK
   * @throws ApiError
   */
  public update(
    code: string,
    requestBody: AdminPostCurrenciesCurrencyReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminCurrenciesRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/admin/currencies/{code}',
      path: {
        'code': code,
      },
      headers: customHeaders,
      body: requestBody,
      mediaType: 'application/json',
    });
  }

}
