/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import {
  AdminAuthRes,
} from '@medusajs/client-types';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class AuthService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * GetAuth
   * Get Current User
   * Gets the currently logged in User.
   * @returns AdminAuthRes OK
   * @throws ApiError
   */
  public getSession(
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminAuthRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/admin/auth',
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
   * User Login
   * Logs a User in and authorizes them to manage Store settings.
   * @returns AdminAuthRes OK
   * @throws ApiError
   */
  public createSession(
    requestBody: {
      /**
       * The User's email.
       */
      email: string;
      /**
       * The User's password.
       */
      password: string;
    },
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminAuthRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/admin/auth',
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
   * User Logout
   * Deletes the current session for the logged in user.
   * @returns any OK
   * @throws ApiError
   */
  public deleteSession(
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<any> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/admin/auth',
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
