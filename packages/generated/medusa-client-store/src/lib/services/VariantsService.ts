/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import {
  StoreGetVariantsParams,
  StoreGetVariantsVariantParams,
  StoreVariantsListRes,
  StoreVariantsRes,
} from '@medusajs/client-types';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class VariantsService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * GetVariants
   * Get Product Variants
   * Retrieves a list of Product Variants
   * @returns StoreVariantsListRes OK
   * @throws ApiError
   */
  public list(
    queryParams: StoreGetVariantsParams,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<StoreVariantsListRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/store/variants',
      headers: customHeaders,
      query: queryParams,
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
      url: '/store/variants/{variant_id}',
      path: {
        'variant_id': variantId,
      },
      headers: customHeaders,
      query: queryParams,
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
