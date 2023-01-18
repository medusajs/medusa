/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdminGetVariantsParams } from '../models/AdminGetVariantsParams';
import type { AdminVariantsListRes } from '../models/AdminVariantsListRes';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class ProductVariantService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * GetVariants
   * List Product Variants
   * Retrieves a list of Product Variants
   * @returns AdminVariantsListRes OK
   * @throws ApiError
   */
  public list(
    queryParams: AdminGetVariantsParams,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminVariantsListRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/variants',
      headers: customHeaders,
      query: {
        'id': queryParams.id,
        'ids': queryParams.ids,
        'expand': queryParams.expand,
        'fields': queryParams.fields,
        'offset': queryParams.offset,
        'limit': queryParams.limit,
        'cart_id': queryParams.cartId,
        'region_id': queryParams.regionId,
        'currency_code': queryParams.currencyCode,
        'customer_id': queryParams.customerId,
        'title': queryParams.title,
        'inventory_quantity': queryParams.inventoryQuantity,
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
