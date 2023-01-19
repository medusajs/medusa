/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdminCreateUserRequest } from '../models/AdminCreateUserRequest';
import type { AdminDeleteUserRes } from '../models/AdminDeleteUserRes';
import type { AdminResetPasswordRequest } from '../models/AdminResetPasswordRequest';
import type { AdminResetPasswordTokenRequest } from '../models/AdminResetPasswordTokenRequest';
import type { AdminUpdateUserRequest } from '../models/AdminUpdateUserRequest';
import type { AdminUserRes } from '../models/AdminUserRes';
import type { AdminUsersListRes } from '../models/AdminUsersListRes';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class UserService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * GetUsers
   * List Users
   * Retrieves all users.
   * @returns AdminUsersListRes OK
   * @throws ApiError
   */
  public list(
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminUsersListRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/users',
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
   * PostUsers
   * Create a User
   * Creates a User
   * @returns AdminUserRes OK
   * @throws ApiError
   */
  public create(
    requestBody: AdminCreateUserRequest,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminUserRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/users',
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
   * PostUsersUserPasswordToken
   * Request Password Reset
   * Generates a password token for a User with a given email.
   * @returns void
   * @throws ApiError
   */
  public sendResetPasswordToken(
    requestBody: AdminResetPasswordTokenRequest,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<void> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/users/password-token',
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
   * PostUsersUserPassword
   * Reset Password
   * Sets the password for a User given the correct token.
   * @returns AdminUserRes OK
   * @throws ApiError
   */
  public resetPassword(
    requestBody: AdminResetPasswordRequest,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminUserRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/users/reset-password',
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
   * GetUsersUser
   * Get a User
   * Retrieves a User.
   * @returns AdminUserRes OK
   * @throws ApiError
   */
  public retrieve(
    id: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminUserRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/users/{id}',
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
   * PostUsersUser
   * Update a User
   * Updates a User
   * @returns AdminUserRes OK
   * @throws ApiError
   */
  public update(
    id: string,
    requestBody: AdminUpdateUserRequest,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminUserRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/users/{id}',
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
   * DeleteUsersUser
   * Delete a User
   * Deletes a User
   * @returns AdminDeleteUserRes OK
   * @throws ApiError
   */
  public delete(
    id: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminDeleteUserRes> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/users/{id}',
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
