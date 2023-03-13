/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import {
  AdminGetProductTypesParams,
  AdminProductTypesListRes,
} from '@medusajs/client-types';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class ProductTypesService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * GetProductTypes
   * List Product Types
   * Retrieve a list of Product Types.
   * @returns AdminProductTypesListRes OK
   * @throws ApiError
   */
  public list(
    queryParams: AdminGetProductTypesParams,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminProductTypesListRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/admin/product-types',
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
