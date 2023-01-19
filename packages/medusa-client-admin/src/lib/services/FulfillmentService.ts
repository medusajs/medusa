/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdminOrdersRes } from '../models/AdminOrdersRes';
import type { AdminPostOrdersOrderClaimsClaimFulfillmentsReq } from '../models/AdminPostOrdersOrderClaimsClaimFulfillmentsReq';
import type { AdminPostOrdersOrderFulfillmentsReq } from '../models/AdminPostOrdersOrderFulfillmentsReq';
import type { AdminPostOrdersOrderSwapsSwapFulfillmentsReq } from '../models/AdminPostOrdersOrderSwapsSwapFulfillmentsReq';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class FulfillmentService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * PostOrdersOrderClaimsClaimFulfillments
   * Create Claim Fulfillment
   * Creates a Fulfillment for a Claim.
   * @returns AdminOrdersRes OK
   * @throws ApiError
   */
  public fulfillClaim(
    id: string,
    claimId: string,
    requestBody: AdminPostOrdersOrderClaimsClaimFulfillmentsReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminOrdersRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/orders/{id}/claims/{claim_id}/fulfillments',
      path: {
        'id': id,
        'claim_id': claimId,
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
   * PostOrdersClaimFulfillmentsCancel
   * Cancel Claim Fulfillment
   * Registers a claim's fulfillment as canceled.
   * @returns AdminOrdersRes OK
   * @throws ApiError
   */
  public cancelClaimFulfillment(
    id: string,
    claimId: string,
    fulfillmentId: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminOrdersRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/orders/{id}/claims/{claim_id}/fulfillments/{fulfillment_id}/cancel',
      path: {
        'id': id,
        'claim_id': claimId,
        'fulfillment_id': fulfillmentId,
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
   * PostOrdersOrderFulfillments
   * Create a Fulfillment
   * Creates a Fulfillment of an Order - will notify Fulfillment Providers to prepare a shipment.
   * @returns AdminOrdersRes OK
   * @throws ApiError
   */
  public createFulfillment(
    id: string,
    requestBody: AdminPostOrdersOrderFulfillmentsReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminOrdersRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/orders/{id}/fulfillment',
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
   * PostOrdersOrderFulfillmentsCancel
   * Cancels a Fulfilmment
   * Registers a Fulfillment as canceled.
   * @returns AdminOrdersRes OK
   * @throws ApiError
   */
  public cancelFulfillment(
    id: string,
    fulfillmentId: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminOrdersRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/orders/{id}/fulfillments/{fulfillment_id}/cancel',
      path: {
        'id': id,
        'fulfillment_id': fulfillmentId,
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
   * PostOrdersOrderSwapsSwapFulfillments
   * Create Swap Fulfillment
   * Creates a Fulfillment for a Swap.
   * @returns AdminOrdersRes OK
   * @throws ApiError
   */
  public fulfillSwap(
    id: string,
    swapId: string,
    requestBody: AdminPostOrdersOrderSwapsSwapFulfillmentsReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminOrdersRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/orders/{id}/swaps/{swap_id}/fulfillments',
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
   * PostOrdersSwapFulfillmentsCancel
   * Cancel Swap's Fulfilmment
   * Registers a Swap's Fulfillment as canceled.
   * @returns AdminOrdersRes OK
   * @throws ApiError
   */
  public cancelSwapFulfillment(
    id: string,
    swapId: string,
    fulfillmentId: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminOrdersRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/orders/{id}/swaps/{swap_id}/fulfillments/{fulfillment_id}/cancel',
      path: {
        'id': id,
        'swap_id': swapId,
        'fulfillment_id': fulfillmentId,
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
