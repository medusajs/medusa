/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import {
  StoreGetPaymentCollectionsParams,
  StorePaymentCollectionSessionsReq,
  StorePaymentCollectionsRes,
  StorePaymentCollectionsSessionRes,
  StorePostPaymentCollectionsBatchSessionsAuthorizeReq,
  StorePostPaymentCollectionsBatchSessionsReq,
} from '@medusajs/client-types';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class PaymentCollectionsService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * GetPaymentCollectionsPaymentCollection
   * Get a PaymentCollection
   * Get a Payment Collection
   * @returns StorePaymentCollectionsRes OK
   * @throws ApiError
   */
  public retrieve(
    id: string,
    queryParams: StoreGetPaymentCollectionsParams,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<StorePaymentCollectionsRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/store/payment-collections/{id}',
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
   * PostPaymentCollectionsSessions
   * Manage a Payment Session
   * Manages Payment Sessions from Payment Collections.
   * @returns StorePaymentCollectionsRes OK
   * @throws ApiError
   */
  public managePaymentSession(
    id: string,
    requestBody: StorePaymentCollectionSessionsReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<StorePaymentCollectionsRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/store/payment-collections/{id}/sessions',
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
   * PostPaymentCollectionsPaymentCollectionSessionsBatch
   * Manage Payment Sessions
   * Manages Multiple Payment Sessions from Payment Collections.
   * @returns StorePaymentCollectionsRes OK
   * @throws ApiError
   */
  public managePaymentSessionsBatch(
    id: string,
    requestBody: StorePostPaymentCollectionsBatchSessionsReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<StorePaymentCollectionsRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/store/payment-collections/{id}/sessions/batch',
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
   * PostPaymentCollectionsSessionsBatchAuthorize
   * Authorize PaymentSessions
   * Authorizes Payment Sessions of a Payment Collection.
   * @returns StorePaymentCollectionsRes OK
   * @throws ApiError
   */
  public authorizePaymentSessionsBatch(
    id: string,
    requestBody: StorePostPaymentCollectionsBatchSessionsAuthorizeReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<StorePaymentCollectionsRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/store/payment-collections/{id}/sessions/batch/authorize',
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
   * PostPaymentCollectionsPaymentCollectionPaymentSessionsSession
   * Refresh a Payment Session
   * Refreshes a Payment Session to ensure that it is in sync with the Payment Collection.
   * @returns StorePaymentCollectionsSessionRes OK
   * @throws ApiError
   */
  public refreshPaymentSession(
    id: string,
    sessionId: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<StorePaymentCollectionsSessionRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/store/payment-collections/{id}/sessions/{session_id}',
      path: {
        'id': id,
        'session_id': sessionId,
      },
      headers: customHeaders,
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
   * PostPaymentCollectionsSessionsSessionAuthorize
   * Authorize Payment Session
   * Authorizes a Payment Session of a Payment Collection.
   * @returns StorePaymentCollectionsSessionRes OK
   * @throws ApiError
   */
  public authorizePaymentSession(
    id: string,
    sessionId: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<StorePaymentCollectionsSessionRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/store/payment-collections/{id}/sessions/{session_id}/authorize',
      path: {
        'id': id,
        'session_id': sessionId,
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
