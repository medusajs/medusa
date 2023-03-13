/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import {
  AdminCustomerGroupsDeleteRes,
  AdminCustomerGroupsListRes,
  AdminCustomerGroupsRes,
  AdminCustomersListRes,
  AdminDeleteCustomerGroupsGroupCustomerBatchReq,
  AdminGetCustomerGroupsGroupParams,
  AdminGetCustomerGroupsParams,
  AdminGetGroupsGroupCustomersParams,
  AdminPostCustomerGroupsGroupCustomersBatchReq,
  AdminPostCustomerGroupsGroupReq,
  AdminPostCustomerGroupsReq,
} from '@medusajs/client-types';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class CustomerGroupsService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * GetCustomerGroups
   * List Customer Groups
   * Retrieve a list of customer groups.
   * @returns AdminCustomerGroupsListRes OK
   * @throws ApiError
   */
  public list(
    queryParams: AdminGetCustomerGroupsParams,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminCustomerGroupsListRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/admin/customer-groups',
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

  /**
   * PostCustomerGroups
   * Create a Customer Group
   * Creates a CustomerGroup.
   * @returns AdminCustomerGroupsRes OK
   * @throws ApiError
   */
  public create(
    requestBody: AdminPostCustomerGroupsReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminCustomerGroupsRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/admin/customer-groups',
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
  public retrieve(
    id: string,
    queryParams: AdminGetCustomerGroupsGroupParams,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminCustomerGroupsRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/admin/customer-groups/{id}',
      path: {
        'id': id,
      },
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
      url: '/admin/customer-groups/{id}',
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
      url: '/admin/customer-groups/{id}',
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
    queryParams: AdminGetGroupsGroupCustomersParams,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminCustomersListRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/admin/customer-groups/{id}/customers',
      path: {
        'id': id,
      },
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
      url: '/admin/customer-groups/{id}/customers/batch',
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
      url: '/admin/customer-groups/{id}/customers/batch',
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
