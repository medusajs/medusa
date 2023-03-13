/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import {
  AdminOrderEditDeleteRes,
  AdminOrderEditItemChangeDeleteRes,
  AdminOrderEditsListRes,
  AdminOrderEditsRes,
  AdminPostOrderEditsEditLineItemsLineItemReq,
  AdminPostOrderEditsEditLineItemsReq,
  AdminPostOrderEditsOrderEditReq,
  AdminPostOrderEditsReq,
  GetOrderEditsOrderEditParams,
  GetOrderEditsParams,
} from '@medusajs/client-types';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class OrderEditsService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * GetOrderEdits
   * List OrderEdits
   * List OrderEdits.
   * @returns AdminOrderEditsListRes OK
   * @throws ApiError
   */
  public list(
    queryParams: GetOrderEditsParams,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminOrderEditsListRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/admin/order-edits',
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
   * PostOrderEdits
   * Create an OrderEdit
   * Creates an OrderEdit.
   * @returns AdminOrderEditsRes OK
   * @throws ApiError
   */
  public create(
    requestBody: AdminPostOrderEditsReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminOrderEditsRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/admin/order-edits',
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
   * GetOrderEditsOrderEdit
   * Get an OrderEdit
   * Retrieves a OrderEdit.
   * @returns AdminOrderEditsRes OK
   * @throws ApiError
   */
  public retrieve(
    id: string,
    queryParams: GetOrderEditsOrderEditParams,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminOrderEditsRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/admin/order-edits/{id}',
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
   * PostOrderEditsOrderEdit
   * Update an OrderEdit
   * Updates a OrderEdit.
   * @returns AdminOrderEditsRes OK
   * @throws ApiError
   */
  public update(
    id: string,
    requestBody: AdminPostOrderEditsOrderEditReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminOrderEditsRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/admin/order-edits/{id}',
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
   * DeleteOrderEditsOrderEdit
   * Delete an Order Edit
   * Delete an Order Edit
   * @returns AdminOrderEditDeleteRes OK
   * @throws ApiError
   */
  public delete(
    id: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminOrderEditDeleteRes> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/admin/order-edits/{id}',
      path: {
        'id': id,
      },
      headers: customHeaders,
      errors: {
        400: `Client Error or Multiple Errors`,
      },
    });
  }

  /**
   * PostOrderEditsOrderEditCancel
   * Cancel an OrderEdit
   * Cancels an OrderEdit.
   * @returns AdminOrderEditsRes OK
   * @throws ApiError
   */
  public cancel(
    id: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminOrderEditsRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/admin/order-edits/{id}/cancel',
      path: {
        'id': id,
      },
      headers: customHeaders,
      errors: {
        400: `Client Error or Multiple Errors`,
        401: `User is not authorized. Must log in first`,
        404: `Not Found Error`,
        500: `Server Error`,
      },
    });
  }

  /**
   * DeleteOrderEditsOrderEditItemChange
   * Delete a Line Item Change
   * Deletes an Order Edit Item Change
   * @returns AdminOrderEditItemChangeDeleteRes OK
   * @throws ApiError
   */
  public deleteItemChange(
    id: string,
    changeId: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminOrderEditItemChangeDeleteRes> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/admin/order-edits/{id}/changes/{change_id}',
      path: {
        'id': id,
        'change_id': changeId,
      },
      headers: customHeaders,
      errors: {
        400: `Client Error or Multiple Errors`,
      },
    });
  }

  /**
   * PostOrderEditsOrderEditConfirm
   * Confirms an OrderEdit
   * Confirms an OrderEdit.
   * @returns AdminOrderEditsRes OK
   * @throws ApiError
   */
  public confirm(
    id: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminOrderEditsRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/admin/order-edits/{id}/confirm',
      path: {
        'id': id,
      },
      headers: customHeaders,
      errors: {
        400: `Client Error or Multiple Errors`,
        401: `User is not authorized. Must log in first`,
        404: `Not Found Error`,
        500: `Server Error`,
      },
    });
  }

  /**
   * PostOrderEditsEditLineItems
   * Add a Line Item
   * Create an OrderEdit LineItem.
   * @returns AdminOrderEditsRes OK
   * @throws ApiError
   */
  public addLineItem(
    id: string,
    requestBody: AdminPostOrderEditsEditLineItemsReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminOrderEditsRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/admin/order-edits/{id}/items',
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
   * PostOrderEditsEditLineItemsLineItem
   * Upsert Line Item Change
   * Create or update the order edit change holding the line item changes
   * @returns AdminOrderEditsRes OK
   * @throws ApiError
   */
  public updateLineItem(
    id: string,
    itemId: string,
    requestBody: AdminPostOrderEditsEditLineItemsLineItemReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminOrderEditsRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/admin/order-edits/{id}/items/{item_id}',
      path: {
        'id': id,
        'item_id': itemId,
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
   * DeleteOrderEditsOrderEditLineItemsLineItem
   * Delete a Line Item
   * Delete line items from an order edit and create change item
   * @returns AdminOrderEditsRes OK
   * @throws ApiError
   */
  public removeLineItem(
    id: string,
    itemId: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminOrderEditsRes> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/admin/order-edits/{id}/items/{item_id}',
      path: {
        'id': id,
        'item_id': itemId,
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
   * PostOrderEditsOrderEditRequest
   * Request Confirmation
   * Request customer confirmation of an Order Edit
   * @returns AdminOrderEditsRes OK
   * @throws ApiError
   */
  public requestConfirmation(
    id: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminOrderEditsRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/admin/order-edits/{id}/request',
      path: {
        'id': id,
      },
      headers: customHeaders,
      errors: {
        400: `Client Error or Multiple Errors`,
        401: `User is not authorized. Must log in first`,
        404: `Not Found Error`,
        500: `Server Error`,
      },
    });
  }

}
