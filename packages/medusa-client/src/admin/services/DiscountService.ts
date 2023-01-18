/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdminDiscountsDeleteRes } from '../models/AdminDiscountsDeleteRes';
import type { AdminDiscountsListRes } from '../models/AdminDiscountsListRes';
import type { AdminDiscountsRes } from '../models/AdminDiscountsRes';
import type { AdminGetDiscountParams } from '../models/AdminGetDiscountParams';
import type { AdminGetDiscountsDiscountCodeParams } from '../models/AdminGetDiscountsDiscountCodeParams';
import type { AdminGetDiscountsParams } from '../models/AdminGetDiscountsParams';
import type { AdminPostDiscountsDiscountConditionsCondition } from '../models/AdminPostDiscountsDiscountConditionsCondition';
import type { AdminPostDiscountsDiscountConditionsConditionParams } from '../models/AdminPostDiscountsDiscountConditionsConditionParams';
import type { AdminPostDiscountsDiscountDynamicCodesReq } from '../models/AdminPostDiscountsDiscountDynamicCodesReq';
import type { AdminPostDiscountsDiscountParams } from '../models/AdminPostDiscountsDiscountParams';
import type { AdminPostDiscountsDiscountReq } from '../models/AdminPostDiscountsDiscountReq';
import type { AdminPostDiscountsParams } from '../models/AdminPostDiscountsParams';
import type { AdminPostDiscountsReq } from '../models/AdminPostDiscountsReq';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class DiscountService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * GetDiscounts
   * List Discounts
   * Retrieves a list of Discounts
   * @returns AdminDiscountsListRes OK
   * @throws ApiError
   */
  public list(
    queryParams: AdminGetDiscountsParams,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminDiscountsListRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/discounts',
      headers: customHeaders,
      query: {
        'q': queryParams.q,
        'rule': queryParams.rule,
        'is_dynamic': queryParams.isDynamic,
        'is_disabled': queryParams.isDisabled,
        'limit': queryParams.limit,
        'offset': queryParams.offset,
        'expand': queryParams.expand,
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

  /**
   * PostDiscounts
   * Creates a Discount
   * Creates a Discount with a given set of rules that define how the Discount behaves.
   * @returns AdminDiscountsRes OK
   * @throws ApiError
   */
  public create(
    requestBody: AdminPostDiscountsReq,
    queryParams: AdminPostDiscountsParams,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminDiscountsRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/discounts',
      headers: customHeaders,
      query: {
        'expand': queryParams.expand,
        'fields': queryParams.fields,
      },
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
   * GetDiscountsDiscountCode
   * Get Discount by Code
   * Retrieves a Discount by its discount code
   * @returns AdminDiscountsRes OK
   * @throws ApiError
   */
  public retrieveByCode(
    code: string,
    queryParams: AdminGetDiscountsDiscountCodeParams,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminDiscountsRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/discounts/code/{code}',
      path: {
        'code': code,
      },
      headers: customHeaders,
      query: {
        'expand': queryParams.expand,
        'fields': queryParams.fields,
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

  /**
   * PostDiscountsDiscountConditionsCondition
   * Update a Condition
   * Updates a DiscountCondition. Only one of `products`, `product_types`, `product_collections`, `product_tags`, and `customer_groups` should be provided.
   * @returns AdminDiscountsRes OK
   * @throws ApiError
   */
  public updateCondition(
    discountId: string,
    conditionId: string,
    requestBody: AdminPostDiscountsDiscountConditionsCondition,
    queryParams: AdminPostDiscountsDiscountConditionsConditionParams,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminDiscountsRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/discounts/{discount_id}/conditions/{condition_id}',
      path: {
        'discount_id': discountId,
        'condition_id': conditionId,
      },
      headers: customHeaders,
      query: {
        'expand': queryParams.expand,
        'fields': queryParams.fields,
      },
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
   * GetDiscountsDiscount
   * Get a Discount
   * Retrieves a Discount
   * @returns AdminDiscountsRes OK
   * @throws ApiError
   */
  public retrieve(
    id: string,
    queryParams: AdminGetDiscountParams,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminDiscountsRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/discounts/{id}',
      path: {
        'id': id,
      },
      headers: customHeaders,
      query: {
        'expand': queryParams.expand,
        'fields': queryParams.fields,
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

  /**
   * PostDiscountsDiscount
   * Update a Discount
   * Updates a Discount with a given set of rules that define how the Discount behaves.
   * @returns AdminDiscountsRes OK
   * @throws ApiError
   */
  public update(
    id: string,
    requestBody: AdminPostDiscountsDiscountReq,
    queryParams: AdminPostDiscountsDiscountParams,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminDiscountsRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/discounts/{id}',
      path: {
        'id': id,
      },
      headers: customHeaders,
      query: {
        'expand': queryParams.expand,
        'fields': queryParams.fields,
      },
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
   * DeleteDiscountsDiscount
   * Delete a Discount
   * Deletes a Discount.
   * @returns AdminDiscountsDeleteRes OK
   * @throws ApiError
   */
  public delete(
    id: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminDiscountsDeleteRes> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/discounts/{id}',
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
   * PostDiscountsDiscountDynamicCodes
   * Create a Dynamic Code
   * Creates a dynamic unique code that can map to a parent Discount. This is useful if you want to automatically generate codes with the same behaviour.
   * @returns AdminDiscountsRes OK
   * @throws ApiError
   */
  public createDynamicCode(
    id: string,
    requestBody: AdminPostDiscountsDiscountDynamicCodesReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminDiscountsRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/discounts/{id}/dynamic-codes',
      path: {
        'id': id,
      },
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
   * DeleteDiscountsDiscountDynamicCodesCode
   * Delete a Dynamic Code
   * Deletes a dynamic code from a Discount.
   * @returns AdminDiscountsRes OK
   * @throws ApiError
   */
  public deleteDynamicCode(
    id: string,
    code: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminDiscountsRes> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/discounts/{id}/dynamic-codes/{code}',
      path: {
        'id': id,
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
   * PostDiscountsDiscountRegionsRegion
   * Add Region
   * Adds a Region to the list of Regions that a Discount can be used in.
   * @returns AdminDiscountsRes OK
   * @throws ApiError
   */
  public addRegion(
    id: string,
    regionId: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminDiscountsRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/discounts/{id}/regions/{region_id}',
      path: {
        'id': id,
        'region_id': regionId,
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
   * DeleteDiscountsDiscountRegionsRegion
   * Remove Region
   * Removes a Region from the list of Regions that a Discount can be used in.
   * @returns AdminDiscountsRes OK
   * @throws ApiError
   */
  public removeRegion(
    id: string,
    regionId: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminDiscountsRes> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/discounts/{id}/regions/{region_id}',
      path: {
        'id': id,
        'region_id': regionId,
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

}
