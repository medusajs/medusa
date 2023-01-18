/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdminDeleteDiscountsDiscountConditionsConditionBatchReq } from '../models/AdminDeleteDiscountsDiscountConditionsConditionBatchReq';
import type { AdminDeleteDiscountsDiscountConditionsConditionParams } from '../models/AdminDeleteDiscountsDiscountConditionsConditionParams';
import type { AdminDiscountConditionsDeleteRes } from '../models/AdminDiscountConditionsDeleteRes';
import type { AdminDiscountConditionsRes } from '../models/AdminDiscountConditionsRes';
import type { AdminDiscountsRes } from '../models/AdminDiscountsRes';
import type { AdminGetDiscountsDiscountConditionsConditionParams } from '../models/AdminGetDiscountsDiscountConditionsConditionParams';
import type { AdminPostDiscountsDiscountConditions } from '../models/AdminPostDiscountsDiscountConditions';
import type { AdminPostDiscountsDiscountConditionsConditionBatchParams } from '../models/AdminPostDiscountsDiscountConditionsConditionBatchParams';
import type { AdminPostDiscountsDiscountConditionsConditionBatchReq } from '../models/AdminPostDiscountsDiscountConditionsConditionBatchReq';
import type { AdminPostDiscountsDiscountConditionsParams } from '../models/AdminPostDiscountsDiscountConditionsParams';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class DiscountConditionService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * PostDiscountsDiscountConditions
   * Create a Condition
   * Creates a DiscountCondition. Only one of `products`, `product_types`, `product_collections`, `product_tags`, and `customer_groups` should be provided.
   * @returns AdminDiscountsRes OK
   * @throws ApiError
   */
  public createCondition(
    discountId: string,
    requestBody: AdminPostDiscountsDiscountConditions,
    queryParams: AdminPostDiscountsDiscountConditionsParams,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminDiscountsRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/discounts/{discount_id}/conditions',
      path: {
        'discount_id': discountId,
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
   * GetDiscountsDiscountConditionsCondition
   * Get a Condition
   * Gets a DiscountCondition
   * @returns AdminDiscountConditionsRes OK
   * @throws ApiError
   */
  public getCondition(
    discountId: string,
    conditionId: string,
    queryParams: AdminGetDiscountsDiscountConditionsConditionParams,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminDiscountConditionsRes> {
    return this.httpRequest.request({
      method: 'GET',
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
   * DeleteDiscountsDiscountConditionsCondition
   * Delete a Condition
   * Deletes a DiscountCondition
   * @returns AdminDiscountConditionsDeleteRes OK
   * @throws ApiError
   */
  public deleteCondition(
    discountId: string,
    conditionId: string,
    queryParams: AdminDeleteDiscountsDiscountConditionsConditionParams,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminDiscountConditionsDeleteRes> {
    return this.httpRequest.request({
      method: 'DELETE',
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
   * PostDiscountsDiscountConditionsConditionBatch
   * Add Batch Resources
   * Add a batch of resources to a discount condition.
   * @returns AdminDiscountsRes OK
   * @throws ApiError
   */
  public addConditionResourceBatch(
    discountId: string,
    conditionId: string,
    requestBody: AdminPostDiscountsDiscountConditionsConditionBatchReq,
    queryParams: AdminPostDiscountsDiscountConditionsConditionBatchParams,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminDiscountsRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/discounts/{discount_id}/conditions/{condition_id}/batch',
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
   * DeleteDiscountsDiscountConditionsConditionBatch
   * Delete Batch Resources
   * Delete a batch of resources from a discount condition.
   * @returns AdminDiscountsRes OK
   * @throws ApiError
   */
  public deleteConditionResourceBatch(
    discountId: string,
    conditionId: string,
    requestBody: AdminDeleteDiscountsDiscountConditionsConditionBatchReq,
    queryParams: {
      /**
       * (Comma separated) Which relations should be expanded in each discount of the result.
       */
      expand?: string,
      /**
       * (Comma separated) Which fields should be included in each discount of the result.
       */
      fields?: string,
    },
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminDiscountsRes> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/discounts/{discount_id}/conditions/{condition_id}/batch',
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

}
