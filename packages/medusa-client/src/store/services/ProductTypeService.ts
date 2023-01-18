/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { StoreGetProductTypesParams } from '../models/StoreGetProductTypesParams';
import type { StoreProductTypesListRes } from '../models/StoreProductTypesListRes';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class ProductTypeService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * GetProductTypes
   * List Product Types
   * Retrieve a list of Product Types.
   * @returns StoreProductTypesListRes OK
   * @throws ApiError
   */
  public list(
    queryParams: StoreGetProductTypesParams,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<StoreProductTypesListRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/product-types',
      headers: customHeaders,
      query: {
        'limit': queryParams.limit,
        'offset': queryParams.offset,
        'order': queryParams.order,
        'discount_condition_id': queryParams.discountConditionId,
        'value': queryParams.value,
        'id': queryParams.id,
        'q': queryParams.q,
        'created_at': queryParams.createdAt,
        'updated_at': queryParams.updatedAt,
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
