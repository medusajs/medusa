/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdminPaymentCollectionDeleteRes } from '../models/AdminPaymentCollectionDeleteRes';
import type { AdminPaymentCollectionsRes } from '../models/AdminPaymentCollectionsRes';
import type { AdminUpdatePaymentCollectionsReq } from '../models/AdminUpdatePaymentCollectionsReq';
import type { GetPaymentCollectionsParams } from '../models/GetPaymentCollectionsParams';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class PaymentCollectionService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * GetPaymentCollectionsPaymentCollection
   * Get a PaymentCollection
   * Retrieves a PaymentCollection.
   * @returns AdminPaymentCollectionsRes OK
   * @throws ApiError
   */
  public retrieve(
    id: string,
    queryParams: GetPaymentCollectionsParams,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminPaymentCollectionsRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/payment-collections/{id}',
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
   * PostPaymentCollectionsPaymentCollection
   * Update PaymentCollection
   * Updates a PaymentCollection.
   * @returns AdminPaymentCollectionsRes OK
   * @throws ApiError
   */
  public update(
    id: string,
    requestBody: AdminUpdatePaymentCollectionsReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminPaymentCollectionsRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/payment-collections/{id}',
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
   * DeletePaymentCollectionsPaymentCollection
   * Del a PaymentCollection
   * Deletes a Payment Collection
   * @returns AdminPaymentCollectionDeleteRes OK
   * @throws ApiError
   */
  public delete(
    id: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminPaymentCollectionDeleteRes> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/payment-collections/{id}',
      path: {
        'id': id,
      },
      headers: customHeaders,
      errors: {
        400: `Client Error or Multiple Errors`,
        401: `User is not authorized. Must log in first`,
      },
    });
  }

  /**
   * PostPaymentCollectionsPaymentCollectionAuthorize
   * Mark Authorized
   * Sets the status of PaymentCollection as Authorized.
   * @returns AdminPaymentCollectionsRes OK
   * @throws ApiError
   */
  public markAsAuthorized(
    id: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminPaymentCollectionsRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/payment-collections/{id}/authorize',
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
