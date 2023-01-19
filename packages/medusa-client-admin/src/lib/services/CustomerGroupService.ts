/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdminCustomerGroupsDeleteRes } from '../models/AdminCustomerGroupsDeleteRes';
import type { AdminCustomerGroupsListRes } from '../models/AdminCustomerGroupsListRes';
import type { AdminCustomerGroupsRes } from '../models/AdminCustomerGroupsRes';
import type { AdminCustomersListRes } from '../models/AdminCustomersListRes';
import type { AdminDeleteCustomerGroupsGroupCustomerBatchReq } from '../models/AdminDeleteCustomerGroupsGroupCustomerBatchReq';
import type { AdminGetCustomerGroupsParams } from '../models/AdminGetCustomerGroupsParams';
import type { AdminPostCustomerGroupsGroupCustomersBatchReq } from '../models/AdminPostCustomerGroupsGroupCustomersBatchReq';
import type { AdminPostCustomerGroupsGroupReq } from '../models/AdminPostCustomerGroupsGroupReq';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class CustomerGroupService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * GetCustomerGroups
   * List Customer Groups
   * Retrieve a list of customer groups.
   * @returns AdminCustomerGroupsListRes OK
   * @throws ApiError
   */
  public AdminGetCustomerGroupsParams(
    queryParams: {
      /**
       * Query used for searching customer group names.
       */
      q?: string,
      /**
       * How many groups to skip in the result.
       */
      offset?: number,
      /**
       * the field used to order the customer groups.
       */
      order?: string,
      /**
       * The discount condition id on which to filter the customer groups.
       */
      discount_condition_id?: string,
      /**
       * Filter by the customer group ID
       */
      id?: (string | Array<string> | {
        /**
         * filter by IDs less than this ID
         */
        lt?: string;
        /**
         * filter by IDs greater than this ID
         */
        gt?: string;
        /**
         * filter by IDs less than or equal to this ID
         */
        lte?: string;
        /**
         * filter by IDs greater than or equal to this ID
         */
        gte?: string;
      }),
      /**
       * Filter by the customer group name
       */
      name?: Array<string>,
      /**
       * Date comparison for when resulting customer groups were created.
       */
      created_at?: {
        /**
         * filter by dates less than this date
         */
        lt?: string;
        /**
         * filter by dates greater than this date
         */
        gt?: string;
        /**
         * filter by dates less than or equal to this date
         */
        lte?: string;
        /**
         * filter by dates greater than or equal to this date
         */
        gte?: string;
      },
      /**
       * Date comparison for when resulting customer groups were updated.
       */
      updated_at?: {
        /**
         * filter by dates less than this date
         */
        lt?: string;
        /**
         * filter by dates greater than this date
         */
        gt?: string;
        /**
         * filter by dates less than or equal to this date
         */
        lte?: string;
        /**
         * filter by dates greater than or equal to this date
         */
        gte?: string;
      },
      /**
       * Limit the number of customer groups returned.
       */
      limit?: number,
      /**
       * (Comma separated) Which fields should be expanded in each customer groups of the result.
       */
      expand?: string,
    },
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminCustomerGroupsListRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/customer-groups',
      headers: customHeaders,
      query: {
        'q': queryParams.q,
        'offset': queryParams.offset,
        'order': queryParams.order,
        'discount_condition_id': queryParams.discount_condition_id,
        'id': queryParams.id,
        'name': queryParams.name,
        'created_at': queryParams.created_at,
        'updated_at': queryParams.updated_at,
        'limit': queryParams.limit,
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
   * PostCustomerGroups
   * Create a Customer Group
   * Creates a CustomerGroup.
   * @returns AdminCustomerGroupsRes OK
   * @throws ApiError
   */
  public create(
    requestBody: {
      /**
       * Name of the customer group
       */
      name: string;
      /**
       * Metadata for the customer.
       */
      metadata?: Record<string, any>;
    },
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminCustomerGroupsRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/customer-groups',
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
   * GetCustomerGroupsGroup
   * Get a Customer Group
   * Retrieves a Customer Group.
   * @returns AdminCustomerGroupsRes OK
   * @throws ApiError
   */
  public list(
    id: string,
    queryParams: AdminGetCustomerGroupsParams,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminCustomerGroupsRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/customer-groups/{id}',
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
   * PostCustomerGroupsGroup
   * Update a Customer Group
   * Update a CustomerGroup.
   * @returns AdminCustomerGroupsRes OK
   * @throws ApiError
   */
  public update(
    id: string,
    requestBody: AdminPostCustomerGroupsGroupReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminCustomerGroupsRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/customer-groups/{id}',
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
   * DeleteCustomerGroupsCustomerGroup
   * Delete a Customer Group
   * Deletes a CustomerGroup.
   * @returns AdminCustomerGroupsDeleteRes OK
   * @throws ApiError
   */
  public delete(
    id: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminCustomerGroupsDeleteRes> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/customer-groups/{id}',
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
   * GetCustomerGroupsGroupCustomers
   * List Customers
   * Retrieves a list of customers in a customer group
   * @returns AdminCustomersListRes OK
   * @throws ApiError
   */
  public listCustomers(
    id: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminCustomersListRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/customer-groups/{id}/customers',
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
   * PostCustomerGroupsGroupCustomersBatch
   * Add Customers
   * Adds a list of customers, represented by id's, to a customer group.
   * @returns AdminCustomerGroupsRes OK
   * @throws ApiError
   */
  public addCustomers(
    id: string,
    requestBody: AdminPostCustomerGroupsGroupCustomersBatchReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminCustomerGroupsRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/customer-groups/{id}/customers/batch',
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
   * DeleteCustomerGroupsGroupCustomerBatch
   * Remove Customers
   * Removes a list of customers, represented by id's, from a customer group.
   * @returns AdminCustomerGroupsRes OK
   * @throws ApiError
   */
  public removeCustomers(
    id: string,
    requestBody: AdminDeleteCustomerGroupsGroupCustomerBatchReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminCustomerGroupsRes> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/customer-groups/{id}/customers/batch',
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

}
