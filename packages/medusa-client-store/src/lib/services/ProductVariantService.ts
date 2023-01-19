/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { StoreGetVariantsVariantParams } from '../models/StoreGetVariantsVariantParams';
import type { StoreVariantsListRes } from '../models/StoreVariantsListRes';
import type { StoreVariantsRes } from '../models/StoreVariantsRes';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class ProductVariantService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * GetVariants
   * Get Product Variants
   * Retrieves a list of Product Variants
   * @returns StoreVariantsListRes OK
   * @throws ApiError
   */
  public getVariants(
    queryParams: {
      /**
       * A comma separated list of Product Variant ids to filter by.
       */
      ids?: string,
      /**
       * A comma separated list of Product Variant relations to load.
       */
      expand?: string,
      /**
       * How many product variants to skip in the result.
       */
      offset?: number,
      /**
       * Maximum number of Product Variants to return.
       */
      limit?: number,
      /**
       * The id of the Cart to set prices based on.
       */
      cart_id?: string,
      /**
       * The id of the Region to set prices based on.
       */
      region_id?: string,
      /**
       * The currency code to use for price selection.
       */
      currency_code?: string,
      /**
       * product variant title to search for.
       */
      title?: (string | Array<string>),
      /**
       * Filter by available inventory quantity
       */
      inventory_quantity?: (number | {
        /**
         * filter by inventory quantity less than this number
         */
        lt?: number;
        /**
         * filter by inventory quantity greater than this number
         */
        gt?: number;
        /**
         * filter by inventory quantity less than or equal to this number
         */
        lte?: number;
        /**
         * filter by inventory quantity greater than or equal to this number
         */
        gte?: number;
      }),
    },
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<StoreVariantsListRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/variants',
      headers: customHeaders,
      query: {
        'ids': queryParams.ids,
        'expand': queryParams.expand,
        'offset': queryParams.offset,
        'limit': queryParams.limit,
        'cart_id': queryParams.cart_id,
        'region_id': queryParams.region_id,
        'currency_code': queryParams.currency_code,
        'title': queryParams.title,
        'inventory_quantity': queryParams.inventory_quantity,
      },
      errors: {
        400: `Client Error or Multiple Errors`,
        404: `Not Found Error`,
        409: `Invalid State Error`,
        422: `Invalid Request Error`,
        500: `Server Error`,
      },
    });
  }

  /**
   * GetVariantsVariant
   * Get a Product Variant
   * Retrieves a Product Variant by id
   * @returns StoreVariantsRes OK
   * @throws ApiError
   */
  public retrieve(
    variantId: string,
    queryParams: StoreGetVariantsVariantParams,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<StoreVariantsRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/variants/{variant_id}',
      path: {
        'variant_id': variantId,
      },
      headers: customHeaders,
      query: {
        'cart_id': queryParams.cart_id,
        'region_id': queryParams.region_id,
        'currency_code': queryParams.currency_code,
      },
      errors: {
        400: `Client Error or Multiple Errors`,
        404: `Not Found Error`,
        409: `Invalid State Error`,
        422: `Invalid Request Error`,
        500: `Server Error`,
      },
    });
  }

}
