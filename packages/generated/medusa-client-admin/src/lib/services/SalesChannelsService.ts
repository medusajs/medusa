/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import {
  AdminDeleteSalesChannelsChannelProductsBatchReq,
  AdminDeleteSalesChannelsChannelStockLocationsReq,
  AdminGetSalesChannelsParams,
  AdminPostSalesChannelsChannelProductsBatchReq,
  AdminPostSalesChannelsChannelStockLocationsReq,
  AdminPostSalesChannelsReq,
  AdminPostSalesChannelsSalesChannelReq,
  AdminSalesChannelsDeleteLocationRes,
  AdminSalesChannelsDeleteRes,
  AdminSalesChannelsListRes,
  AdminSalesChannelsRes,
} from '@medusajs/client-types';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class SalesChannelsService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * GetSalesChannels
   * List Sales Channels
   * Retrieves a list of sales channels
   * @returns AdminSalesChannelsListRes OK
   * @throws ApiError
   */
  public list(
    queryParams: AdminGetSalesChannelsParams,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminSalesChannelsListRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/admin/sales-channels',
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
   * PostSalesChannels
   * Create a Sales Channel
   * Creates a Sales Channel.
   * @returns AdminSalesChannelsRes OK
   * @throws ApiError
   */
  public create(
    requestBody: AdminPostSalesChannelsReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminSalesChannelsRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/admin/sales-channels',
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
   * GetSalesChannelsSalesChannel
   * Get a Sales Channel
   * Retrieves the sales channel.
   * @returns AdminSalesChannelsRes OK
   * @throws ApiError
   */
  public retrieve(
    id: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminSalesChannelsRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/admin/sales-channels/{id}',
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
   * PostSalesChannelsSalesChannel
   * Update a Sales Channel
   * Updates a Sales Channel.
   * @returns AdminSalesChannelsRes OK
   * @throws ApiError
   */
  public update(
    id: string,
    requestBody: AdminPostSalesChannelsSalesChannelReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminSalesChannelsRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/admin/sales-channels/{id}',
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
   * DeleteSalesChannelsSalesChannel
   * Delete a Sales Channel
   * Deletes the sales channel.
   * @returns AdminSalesChannelsDeleteRes OK
   * @throws ApiError
   */
  public delete(
    id: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminSalesChannelsDeleteRes> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/admin/sales-channels/{id}',
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
   * PostSalesChannelsChannelProductsBatch
   * Add Products
   * Assign a batch of product to a sales channel.
   * @returns AdminSalesChannelsRes OK
   * @throws ApiError
   */
  public addProducts(
    id: string,
    requestBody: AdminPostSalesChannelsChannelProductsBatchReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminSalesChannelsRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/admin/sales-channels/{id}/products/batch',
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
   * DeleteSalesChannelsChannelProductsBatch
   * Delete Products
   * Remove a list of products from a sales channel.
   * @returns AdminSalesChannelsRes OK
   * @throws ApiError
   */
  public removeProducts(
    id: string,
    requestBody: AdminDeleteSalesChannelsChannelProductsBatchReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminSalesChannelsRes> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/admin/sales-channels/{id}/products/batch',
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
   * PostSalesChannelsSalesChannelStockLocation
   * Associate a stock location to a Sales Channel
   * Associates a stock location to a Sales Channel.
   * @returns AdminSalesChannelsRes OK
   * @throws ApiError
   */
  public addLocation(
    id: string,
    requestBody: AdminPostSalesChannelsChannelStockLocationsReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminSalesChannelsRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/admin/sales-channels/{id}/stock-locations',
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
   * DeleteSalesChannelsSalesChannelStockLocation
   * Remove a stock location from a Sales Channel
   * Removes a stock location from a Sales Channel.
   * @returns AdminSalesChannelsDeleteLocationRes OK
   * @throws ApiError
   */
  public removeLocation(
    id: string,
    requestBody: AdminDeleteSalesChannelsChannelStockLocationsReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminSalesChannelsDeleteLocationRes> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/admin/sales-channels/{id}/stock-locations',
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
