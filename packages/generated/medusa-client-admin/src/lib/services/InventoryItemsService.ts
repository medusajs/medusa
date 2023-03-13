/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import {
  AdminGetInventoryItemsItemLocationLevelsParams,
  AdminGetInventoryItemsItemParams,
  AdminGetInventoryItemsParams,
  AdminInventoryItemsDeleteRes,
  AdminInventoryItemsListWithVariantsAndLocationLevelsRes,
  AdminInventoryItemsLocationLevelsRes,
  AdminInventoryItemsRes,
  AdminPostInventoryItemsInventoryItemParams,
  AdminPostInventoryItemsInventoryItemReq,
  AdminPostInventoryItemsItemLocationLevelsLevelParams,
  AdminPostInventoryItemsItemLocationLevelsLevelReq,
  AdminPostInventoryItemsItemLocationLevelsParams,
  AdminPostInventoryItemsItemLocationLevelsReq,
  AdminPostInventoryItemsParams,
  AdminPostInventoryItemsReq,
} from '@medusajs/client-types';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class InventoryItemsService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * GetInventoryItems
   * List inventory items.
   * Lists inventory items.
   * @returns AdminInventoryItemsListWithVariantsAndLocationLevelsRes OK
   * @throws ApiError
   */
  public list(
    queryParams: AdminGetInventoryItemsParams,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminInventoryItemsListWithVariantsAndLocationLevelsRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/admin/inventory-items',
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
   * PostInventoryItems
   * Create an Inventory Item.
   * Creates an Inventory Item.
   * @returns AdminInventoryItemsRes OK
   * @throws ApiError
   */
  public create(
    requestBody: AdminPostInventoryItemsReq,
    queryParams: AdminPostInventoryItemsParams,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminInventoryItemsRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/admin/inventory-items',
      headers: customHeaders,
      query: queryParams,
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
   * GetInventoryItemsInventoryItem
   * Retrive an Inventory Item.
   * Retrives an Inventory Item.
   * @returns AdminInventoryItemsRes OK
   * @throws ApiError
   */
  public retrieve(
    id: string,
    queryParams: AdminGetInventoryItemsItemParams,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminInventoryItemsRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/admin/inventory-items/{id}',
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
   * PostInventoryItemsInventoryItem
   * Update an Inventory Item.
   * Updates an Inventory Item.
   * @returns AdminInventoryItemsRes OK
   * @throws ApiError
   */
  public update(
    id: string,
    requestBody: AdminPostInventoryItemsInventoryItemReq,
    queryParams: AdminPostInventoryItemsInventoryItemParams,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminInventoryItemsRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/admin/inventory-items/{id}',
      path: {
        'id': id,
      },
      headers: customHeaders,
      query: queryParams,
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
   * DeleteInventoryItemsInventoryItem
   * Delete an Inventory Item
   * Delete an Inventory Item
   * @returns AdminInventoryItemsDeleteRes OK
   * @throws ApiError
   */
  public delete(
    id: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminInventoryItemsDeleteRes> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/admin/inventory-items/{id}',
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
   * GetInventoryItemsInventoryItemLocationLevels
   * List stock levels of a given location.
   * Lists stock levels of a given location.
   * @returns AdminInventoryItemsLocationLevelsRes OK
   * @throws ApiError
   */
  public listLocationLevels(
    id: string,
    queryParams: AdminGetInventoryItemsItemLocationLevelsParams,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminInventoryItemsLocationLevelsRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/admin/inventory-items/{id}/location-levels',
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
   * PostInventoryItemsInventoryItemLocationLevels
   * Create an Inventory Location Level for a given Inventory Item.
   * Creates an Inventory Location Level for a given Inventory Item.
   * @returns AdminInventoryItemsRes OK
   * @throws ApiError
   */
  public createLocationLevel(
    id: string,
    requestBody: AdminPostInventoryItemsItemLocationLevelsReq,
    queryParams: AdminPostInventoryItemsItemLocationLevelsParams,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminInventoryItemsRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/admin/inventory-items/{id}/location-levels',
      path: {
        'id': id,
      },
      headers: customHeaders,
      query: queryParams,
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
   * PostInventoryItemsInventoryItemLocationLevelsLocationLevel
   * Update an Inventory Location Level for a given Inventory Item.
   * Updates an Inventory Location Level for a given Inventory Item.
   * @returns AdminInventoryItemsRes OK
   * @throws ApiError
   */
  public updateLocationLevel(
    id: string,
    locationId: string,
    requestBody: AdminPostInventoryItemsItemLocationLevelsLevelReq,
    queryParams: AdminPostInventoryItemsItemLocationLevelsLevelParams,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminInventoryItemsRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/admin/inventory-items/{id}/location-levels/{location_id}',
      path: {
        'id': id,
        'location_id': locationId,
      },
      headers: customHeaders,
      query: queryParams,
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
   * DeleteInventoryItemsInventoryIteLocationLevelsLocation
   * Delete a location level of an Inventory Item.
   * Delete a location level of an Inventory Item.
   * @returns AdminInventoryItemsRes OK
   * @throws ApiError
   */
  public deleteLocationLevel(
    id: string,
    locationId: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminInventoryItemsRes> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/admin/inventory-items/{id}/location-levels/{location_id}',
      path: {
        'id': id,
        'location_id': locationId,
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
