/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdminPaymentRes } from '../models/AdminPaymentRes';
import type { AdminPostPaymentRefundsReq } from '../models/AdminPostPaymentRefundsReq';
import type { AdminRefundRes } from '../models/AdminRefundRes';
import type { GetPaymentsParams } from '../models/GetPaymentsParams';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class PaymentService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * GetPaymentsPayment
   * Get Payment details
   * Retrieves the Payment details
   * @returns AdminPaymentRes OK
   * @throws ApiError
   */
  public retrieve(
    id: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminPaymentRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/payments/{id}',
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
   * PostPaymentsPaymentCapture
   * Capture a Payment
   * Captures a Payment.
   * @returns AdminPaymentRes OK
   * @throws ApiError
   */
  public capturePayment(
    id: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminPaymentRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/payments/{id}/capture',
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
   * PostPaymentsPaymentRefunds
   * Create a Refund
   * Issues a Refund.
   * @returns AdminRefundRes OK
   * @throws ApiError
   */
  public refundPayment(
    id: string,
    requestBody: AdminPostPaymentRefundsReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminRefundRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/payments/{id}/refund',
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
