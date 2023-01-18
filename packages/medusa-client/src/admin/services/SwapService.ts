/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdminGetSwapsParams } from '../models/AdminGetSwapsParams';
import type { AdminOrdersRes } from '../models/AdminOrdersRes';
import type { AdminPostOrdersOrderSwapsReq } from '../models/AdminPostOrdersOrderSwapsReq';
import type { AdminPostOrdersOrderSwapsSwapShipmentsReq } from '../models/AdminPostOrdersOrderSwapsSwapShipmentsReq';
import type { AdminSwapsListRes } from '../models/AdminSwapsListRes';
import type { AdminSwapsRes } from '../models/AdminSwapsRes';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class SwapService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * PostOrdersOrderSwaps
   * Create a Swap
   * Creates a Swap. Swaps are used to handle Return of previously purchased goods and Fulfillment of replacements simultaneously.
   * @returns AdminOrdersRes OK
   * @throws ApiError
   */
  public createSwap(
    id: string,
    requestBody: AdminPostOrdersOrderSwapsReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminOrdersRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/order/{id}/swaps',
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
   * PostOrdersSwapCancel
   * Cancels a Swap
   * Cancels a Swap
   * @returns AdminOrdersRes OK
   * @throws ApiError
   */
  public cancelSwap(
    id: string,
    swapId: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminOrdersRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/orders/{id}/swaps/{swap_id}/cancel',
      path: {
        'id': id,
        'swap_id': swapId,
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
   * PostOrdersOrderSwapsSwapProcessPayment
   * Process Swap Payment
   * When there are differences between the returned and shipped Products in a Swap, the difference must be processed. Either a Refund will be issued or a Payment will be captured.
   * @returns AdminOrdersRes OK
   * @throws ApiError
   */
  public processSwapPayment(
    id: string,
    swapId: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminOrdersRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/orders/{id}/swaps/{swap_id}/process-payment',
      path: {
        'id': id,
        'swap_id': swapId,
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
   * PostOrdersOrderSwapsSwapShipments
   * Create Swap Shipment
   * Registers a Swap Fulfillment as shipped.
   * @returns AdminOrdersRes OK
   * @throws ApiError
   */
  public createSwapShipment(
    id: string,
    swapId: string,
    requestBody: AdminPostOrdersOrderSwapsSwapShipmentsReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminOrdersRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/orders/{id}/swaps/{swap_id}/shipments',
      path: {
        'id': id,
        'swap_id': swapId,
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
   * GetSwaps
   * List Swaps
   * Retrieves a list of Swaps.
   * @returns AdminSwapsListRes OK
   * @throws ApiError
   */
  public list(
    queryParams: AdminGetSwapsParams,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminSwapsListRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/swaps',
      headers: customHeaders,
      query: {
        'limit': queryParams.limit,
        'offset': queryParams.offset,
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
   * GetSwapsSwap
   * Get a Swap
   * Retrieves a Swap.
   * @returns AdminSwapsRes OK
   * @throws ApiError
   */
  public retrieve(
    id: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminSwapsRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/swaps/{id}',
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
