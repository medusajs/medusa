/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import {
  AdminCollectionsDeleteRes,
  AdminCollectionsListRes,
  AdminCollectionsRes,
  AdminDeleteProductsFromCollectionReq,
  AdminDeleteProductsFromCollectionRes,
  AdminGetCollectionsParams,
  AdminPostCollectionsCollectionReq,
  AdminPostCollectionsReq,
  AdminPostProductsToCollectionReq,
} from '@medusajs/client-types';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class CollectionsService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * GetCollections
   * List Collections
   * Retrieve a list of Product Collection.
   * @returns AdminCollectionsListRes OK
   * @throws ApiError
   */
  public list(
    queryParams: AdminGetCollectionsParams,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminCollectionsListRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/admin/collections',
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
   * PostCollections
   * Create a Collection
   * Creates a Product Collection.
   * @returns AdminCollectionsRes OK
   * @throws ApiError
   */
  public create(
    requestBody: AdminPostCollectionsReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminCollectionsRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/admin/collections',
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
   * GetCollectionsCollection
   * Get a Collection
   * Retrieves a Product Collection.
   * @returns AdminCollectionsRes OK
   * @throws ApiError
   */
  public retrieve(
    id: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminCollectionsRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/admin/collections/{id}',
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
   * PostCollectionsCollection
   * Update a Collection
   * Updates a Product Collection.
   * @returns AdminCollectionsRes OK
   * @throws ApiError
   */
  public update(
    id: string,
    requestBody: AdminPostCollectionsCollectionReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminCollectionsRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/admin/collections/{id}',
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
   * DeleteCollectionsCollection
   * Delete a Collection
   * Deletes a Product Collection.
   * @returns AdminCollectionsDeleteRes OK
   * @throws ApiError
   */
  public delete(
    id: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminCollectionsDeleteRes> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/admin/collections/{id}',
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
   * PostProductsToCollection
   * Update Products
   * Updates products associated with a Product Collection
   * @returns AdminCollectionsRes OK
   * @throws ApiError
   */
  public addProducts(
    id: string,
    requestBody: AdminPostProductsToCollectionReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminCollectionsRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/admin/collections/{id}/products/batch',
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
   * DeleteProductsFromCollection
   * Remove Product
   * Removes products associated with a Product Collection
   * @returns AdminDeleteProductsFromCollectionRes OK
   * @throws ApiError
   */
  public removeProducts(
    id: string,
    requestBody: AdminDeleteProductsFromCollectionReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminDeleteProductsFromCollectionRes> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/admin/collections/{id}/products/batch',
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
