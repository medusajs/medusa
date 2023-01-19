/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { StorePostCustomersCustomerOrderClaimReq } from '../models/StorePostCustomersCustomerOrderClaimReq';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class InviteService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * PostOrdersCustomerOrderClaim
   * Claim an Order
   * Sends an email to emails registered to orders provided with link to transfer order ownership
   * @returns any OK
   * @throws ApiError
   */
  public requestCustomerOrders(
    requestBody: StorePostCustomersCustomerOrderClaimReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<any> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/orders/batch/customer/token',
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
