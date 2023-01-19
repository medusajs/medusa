/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdminCurrenciesListRes } from '../models/AdminCurrenciesListRes';
import type { AdminCurrenciesRes } from '../models/AdminCurrenciesRes';
import type { AdminGetCurrenciesParams } from '../models/AdminGetCurrenciesParams';
import type { AdminPostCurrenciesCurrencyReq } from '../models/AdminPostCurrenciesCurrencyReq';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class CurrencyService {

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
      url: '/currencies',
      headers: customHeaders,
      query: {
        'code': queryParams.code,
        'includes_tax': queryParams.includes_tax,
        'order': queryParams.order,
        'offset': queryParams.offset,
        'limit': queryParams.limit,
      },
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
      url: '/currencies/{code}',
      path: {
        'code': code,
      },
      headers: customHeaders,
      body: requestBody,
      mediaType: 'application/json',
    });
  }

}
