/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdminGetProductTypesParams } from '../models/AdminGetProductTypesParams';
import type { AdminProductTypesListRes } from '../models/AdminProductTypesListRes';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class ProductTypeService {

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
      url: '/product-types',
      headers: customHeaders,
      query: {
        'limit': queryParams.limit,
        'offset': queryParams.offset,
        'order': queryParams.order,
        'discount_condition_id': queryParams.discount_condition_id,
        'value': queryParams.value,
        'id': queryParams.id,
        'q': queryParams.q,
        'created_at': queryParams.created_at,
        'updated_at': queryParams.updated_at,
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

}
