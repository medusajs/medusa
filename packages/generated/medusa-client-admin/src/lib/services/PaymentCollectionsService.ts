/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import {
  AdminGetPaymentCollectionsParams,
  AdminPaymentCollectionDeleteRes,
  AdminPaymentCollectionsRes,
  AdminUpdatePaymentCollectionsReq,
} from '@medusajs/client-types';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class PaymentCollectionsService {

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
    queryParams: AdminGetPaymentCollectionsParams,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminPaymentCollectionsRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/admin/payment-collections/{id}',
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
      url: '/admin/payment-collections/{id}',
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
      url: '/admin/payment-collections/{id}',
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
      url: '/admin/payment-collections/{id}/authorize',
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
