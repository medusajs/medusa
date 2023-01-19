/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdminDeletePublishableApiKeySalesChannelsBatchReq } from '../models/AdminDeletePublishableApiKeySalesChannelsBatchReq';
import type { AdminPostPublishableApiKeySalesChannelsBatchReq } from '../models/AdminPostPublishableApiKeySalesChannelsBatchReq';
import type { AdminPostPublishableApiKeysPublishableApiKeyReq } from '../models/AdminPostPublishableApiKeysPublishableApiKeyReq';
import type { AdminPostPublishableApiKeysReq } from '../models/AdminPostPublishableApiKeysReq';
import type { AdminPublishableApiKeyDeleteRes } from '../models/AdminPublishableApiKeyDeleteRes';
import type { AdminPublishableApiKeysListRes } from '../models/AdminPublishableApiKeysListRes';
import type { AdminPublishableApiKeysListSalesChannelsRes } from '../models/AdminPublishableApiKeysListSalesChannelsRes';
import type { AdminPublishableApiKeysRes } from '../models/AdminPublishableApiKeysRes';
import type { GetPublishableApiKeySalesChannelsParams } from '../models/GetPublishableApiKeySalesChannelsParams';
import type { GetPublishableApiKeysParams } from '../models/GetPublishableApiKeysParams';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class PublishableApiKeyService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * PostPublishableApiKysPublishableApiKey
   * Update PublishableApiKey
   * Updates a PublishableApiKey.
   * @returns AdminPublishableApiKeysRes OK
   * @throws ApiError
   */
  public update(
    id: string,
    requestBody: AdminPostPublishableApiKeysPublishableApiKeyReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminPublishableApiKeysRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/publishable-api-key/{id}',
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
   * GetPublishableApiKeys
   * List PublishableApiKeys
   * List PublishableApiKeys.
   * @returns AdminPublishableApiKeysListRes OK
   * @throws ApiError
   */
  public list(
    queryParams: GetPublishableApiKeysParams,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminPublishableApiKeysListRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/publishable-api-keys',
      headers: customHeaders,
      query: {
        'q': queryParams.q,
        'limit': queryParams.limit,
        'offset': queryParams.offset,
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
   * PostPublishableApiKeys
   * Create PublishableApiKey
   * Creates a PublishableApiKey.
   * @returns AdminPublishableApiKeysRes OK
   * @throws ApiError
   */
  public create(
    requestBody: AdminPostPublishableApiKeysReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminPublishableApiKeysRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/publishable-api-keys',
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
   * GetPublishableApiKeysPublishableApiKey
   * Get a PublishableApiKey
   * Retrieve the Publishable Api Key.
   * @returns AdminPublishableApiKeysRes OK
   * @throws ApiError
   */
  public retrieve(
    id: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminPublishableApiKeysRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/publishable-api-keys/{id}',
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
   * DeletePublishableApiKeysPublishableApiKey
   * Delete PublishableApiKey
   * Deletes a PublishableApiKeys
   * @returns AdminPublishableApiKeyDeleteRes OK
   * @throws ApiError
   */
  public delete(
    id: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminPublishableApiKeyDeleteRes> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/publishable-api-keys/{id}',
      path: {
        'id': id,
      },
      headers: customHeaders,
      errors: {
        400: `Client Error or Multiple Errors`,
      },
    });
  }

  /**
   * PostPublishableApiKeysPublishableApiKeyRevoke
   * Revoke PublishableApiKey
   * Revokes a PublishableApiKey.
   * @returns AdminPublishableApiKeysRes OK
   * @throws ApiError
   */
  public revoke(
    id: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminPublishableApiKeysRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/publishable-api-keys/{id}/revoke',
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
   * GetPublishableApiKeySalesChannels
   * List SalesChannels
   * List PublishableApiKey's SalesChannels
   * @returns AdminPublishableApiKeysListSalesChannelsRes OK
   * @throws ApiError
   */
  public listSalesChannels(
    id: string,
    queryParams: GetPublishableApiKeySalesChannelsParams,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminPublishableApiKeysListSalesChannelsRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/publishable-api-keys/{id}/sales-channels',
      path: {
        'id': id,
      },
      headers: customHeaders,
      query: {
        'q': queryParams.q,
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
   * PostPublishableApiKeySalesChannelsChannelsBatch
   * Add SalesChannels
   * Assign a batch of sales channels to a publishable api key.
   * @returns AdminPublishableApiKeysRes OK
   * @throws ApiError
   */
  public addSalesChannelsBatch(
    id: string,
    requestBody: AdminPostPublishableApiKeySalesChannelsBatchReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminPublishableApiKeysRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/publishable-api-keys/{id}/sales-channels/batch',
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
   * DeletePublishableApiKeySalesChannelsChannelsBatch
   * Delete SalesChannels
   * Remove a batch of sales channels from a publishable api key.
   * @returns AdminPublishableApiKeysRes OK
   * @throws ApiError
   */
  public deleteSalesChannelsBatch(
    id: string,
    requestBody: AdminDeletePublishableApiKeySalesChannelsBatchReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminPublishableApiKeysRes> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/publishable-api-keys/{id}/sales-channels/batch',
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
