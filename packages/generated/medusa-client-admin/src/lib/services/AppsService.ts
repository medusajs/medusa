/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import {
  AdminAppsListRes,
  AdminAppsRes,
  AdminPostAppsReq,
} from '@medusajs/client-types';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class AppsService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * GetApps
   * List Applications
   * Retrieve a list of applications.
   * @returns AdminAppsListRes OK
   * @throws ApiError
   */
  public list(
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminAppsListRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/admin/apps',
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
   * PostApps
   * Generate Token for App
   * Generates a token for an application.
   * @returns AdminAppsRes OK
   * @throws ApiError
   */
  public authorize(
    requestBody: AdminPostAppsReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminAppsRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/admin/apps/authorizations',
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
