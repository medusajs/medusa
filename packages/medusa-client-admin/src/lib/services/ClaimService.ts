/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdminOrdersRes } from '../models/AdminOrdersRes';
import type { AdminPostOrdersOrderClaimsClaimReq } from '../models/AdminPostOrdersOrderClaimsClaimReq';
import type { AdminPostOrdersOrderClaimsClaimShipmentsReq } from '../models/AdminPostOrdersOrderClaimsClaimShipmentsReq';
import type { AdminPostOrdersOrderClaimsReq } from '../models/AdminPostOrdersOrderClaimsReq';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class ClaimService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * PostOrdersOrderClaims
   * Create a Claim
   * Creates a Claim.
   * @returns AdminOrdersRes OK
   * @throws ApiError
   */
  public createClaim(
    id: string,
    requestBody: AdminPostOrdersOrderClaimsReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminOrdersRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/order/{id}/claims',
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
   * PostOrdersOrderClaimsClaim
   * Update a Claim
   * Updates a Claim.
   * @returns AdminOrdersRes OK
   * @throws ApiError
   */
  public updateClaim(
    id: string,
    claimId: string,
    requestBody: AdminPostOrdersOrderClaimsClaimReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminOrdersRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/order/{id}/claims/{claim_id}',
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
   * PostOrdersClaimCancel
   * Cancel a Claim
   * Cancels a Claim
   * @returns AdminOrdersRes OK
   * @throws ApiError
   */
  public cancelClaim(
    id: string,
    claimId: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminOrdersRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/orders/{id}/claims/{claim_id}/cancel',
      path: {
        'id': id,
        'claim_id': claimId,
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
   * PostOrdersOrderClaimsClaimShipments
   * Create Claim Shipment
   * Registers a Claim Fulfillment as shipped.
   * @returns AdminOrdersRes OK
   * @throws ApiError
   */
  public createClaimShipment(
    id: string,
    claimId: string,
    requestBody: AdminPostOrdersOrderClaimsClaimShipmentsReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminOrdersRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/orders/{id}/claims/{claim_id}/shipments',
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

}
