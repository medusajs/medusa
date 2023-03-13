/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import {
  AdminDeleteShippingProfileRes,
  AdminPostShippingProfilesProfileReq,
  AdminPostShippingProfilesReq,
  AdminShippingProfilesListRes,
  AdminShippingProfilesRes,
} from '@medusajs/client-types';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class ShippingProfilesService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * GetShippingProfiles
   * List Shipping Profiles
   * Retrieves a list of Shipping Profile.
   * @returns AdminShippingProfilesListRes OK
   * @throws ApiError
   */
  public list(
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminShippingProfilesListRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/admin/shipping-profiles',
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
   * PostShippingProfiles
   * Create a Shipping Profile
   * Creates a Shipping Profile
   * @returns AdminShippingProfilesRes OK
   * @throws ApiError
   */
  public create(
    requestBody: AdminPostShippingProfilesReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminShippingProfilesRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/admin/shipping-profiles',
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
   * GetShippingProfilesProfile
   * Get a Shipping Profile
   * Retrieves a Shipping Profile.
   * @returns AdminShippingProfilesRes OK
   * @throws ApiError
   */
  public retrieve(
    id: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminShippingProfilesRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/admin/shipping-profiles/{id}',
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
   * PostShippingProfilesProfile
   * Update a Shipping Profile
   * Updates a Shipping Profile
   * @returns AdminShippingProfilesRes OK
   * @throws ApiError
   */
  public update(
    id: string,
    requestBody: AdminPostShippingProfilesProfileReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminShippingProfilesRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/admin/shipping-profiles/{id}',
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
   * DeleteShippingProfilesProfile
   * Delete a Shipping Profile
   * Deletes a Shipping Profile.
   * @returns AdminDeleteShippingProfileRes OK
   * @throws ApiError
   */
  public delete(
    id: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminDeleteShippingProfileRes> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/admin/shipping-profiles/{id}',
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
