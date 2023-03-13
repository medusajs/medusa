/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import {
  AdminDraftOrdersDeleteRes,
  AdminDraftOrdersListRes,
  AdminDraftOrdersRes,
  AdminGetDraftOrdersParams,
  AdminPostDraftOrdersDraftOrderLineItemsItemReq,
  AdminPostDraftOrdersDraftOrderLineItemsReq,
  AdminPostDraftOrdersDraftOrderRegisterPaymentRes,
  AdminPostDraftOrdersDraftOrderReq,
  AdminPostDraftOrdersReq,
} from '@medusajs/client-types';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class DraftOrdersService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * GetDraftOrders
   * List Draft Orders
   * Retrieves an list of Draft Orders
   * @returns AdminDraftOrdersListRes OK
   * @throws ApiError
   */
  public list(
    queryParams: AdminGetDraftOrdersParams,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminDraftOrdersListRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/admin/draft-orders',
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
   * PostDraftOrders
   * Create a Draft Order
   * Creates a Draft Order
   * @returns AdminDraftOrdersRes OK
   * @throws ApiError
   */
  public create(
    requestBody: AdminPostDraftOrdersReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminDraftOrdersRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/admin/draft-orders',
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
   * GetDraftOrdersDraftOrder
   * Get a Draft Order
   * Retrieves a Draft Order.
   * @returns AdminDraftOrdersRes OK
   * @throws ApiError
   */
  public retrieve(
    id: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminDraftOrdersRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/admin/draft-orders/{id}',
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
   * PostDraftOrdersDraftOrder
   * Update a Draft Order
   * Updates a Draft Order.
   * @returns AdminDraftOrdersRes OK
   * @throws ApiError
   */
  public update(
    id: string,
    requestBody: AdminPostDraftOrdersDraftOrderReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminDraftOrdersRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/admin/draft-orders/{id}',
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
   * DeleteDraftOrdersDraftOrder
   * Delete a Draft Order
   * Deletes a Draft Order
   * @returns AdminDraftOrdersDeleteRes OK
   * @throws ApiError
   */
  public delete(
    id: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminDraftOrdersDeleteRes> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/admin/draft-orders/{id}',
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
   * PostDraftOrdersDraftOrderLineItems
   * Create a Line Item
   * Creates a Line Item for the Draft Order
   * @returns AdminDraftOrdersRes OK
   * @throws ApiError
   */
  public addLineItem(
    id: string,
    requestBody: AdminPostDraftOrdersDraftOrderLineItemsReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminDraftOrdersRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/admin/draft-orders/{id}/line-items',
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
   * PostDraftOrdersDraftOrderLineItemsItem
   * Update a Line Item
   * Updates a Line Item for a Draft Order
   * @returns AdminDraftOrdersRes OK
   * @throws ApiError
   */
  public updateLineItem(
    id: string,
    lineId: string,
    requestBody: AdminPostDraftOrdersDraftOrderLineItemsItemReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminDraftOrdersRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/admin/draft-orders/{id}/line-items/{line_id}',
      path: {
        'id': id,
        'line_id': lineId,
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
   * DeleteDraftOrdersDraftOrderLineItemsItem
   * Delete a Line Item
   * Removes a Line Item from a Draft Order.
   * @returns AdminDraftOrdersRes OK
   * @throws ApiError
   */
  public removeLineItem(
    id: string,
    lineId: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminDraftOrdersRes> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/admin/draft-orders/{id}/line-items/{line_id}',
      path: {
        'id': id,
        'line_id': lineId,
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
   * PostDraftOrdersDraftOrderRegisterPayment
   * Registers a Payment
   * Registers a payment for a Draft Order.
   * @returns AdminPostDraftOrdersDraftOrderRegisterPaymentRes OK
   * @throws ApiError
   */
  public markPaid(
    id: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminPostDraftOrdersDraftOrderRegisterPaymentRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/admin/draft-orders/{id}/pay',
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

}
