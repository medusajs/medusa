/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { StoreAuthRes } from '../models/StoreAuthRes';
import type { StoreGetAuthEmailRes } from '../models/StoreGetAuthEmailRes';
import type { StorePostAuthReq } from '../models/StorePostAuthReq';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class AuthService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * GetAuth
   * Get Current Customer
   * Gets the currently logged in Customer.
   * @returns StoreAuthRes OK
   * @throws ApiError
   */
  public getSession(
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<StoreAuthRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/auth',
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
   * PostAuth
   * Customer Login
   * Logs a Customer in and authorizes them to view their details. Successful authentication will set a session cookie in the Customer's browser.
   * @returns StoreAuthRes OK
   * @throws ApiError
   */
  public create(
    requestBody: StorePostAuthReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<StoreAuthRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/auth',
      headers: customHeaders,
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        400: `Client Error or Multiple Errors`,
        401: `User does not exist or incorrect credentials`,
        404: `Not Found Error`,
        409: `Invalid State Error`,
        422: `Invalid Request Error`,
        500: `Server Error`,
      },
    });
  }

  /**
   * DeleteAuth
   * Customer Log out
   * Destroys a Customer's authenticated session.
   * @returns any OK
   * @throws ApiError
   */
  public deleteSession(
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<any> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/auth',
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
   * GetAuthEmail
   * Check if email exists
   * Checks if a Customer with the given email has signed up.
   * @returns StoreGetAuthEmailRes OK
   * @throws ApiError
   */
  public exists(
    email: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<StoreGetAuthEmailRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/auth/{email}',
      path: {
        'email': email,
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

}
