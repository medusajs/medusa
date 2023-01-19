/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdminCollectionsDeleteRes } from '../models/AdminCollectionsDeleteRes';
import type { AdminCollectionsListRes } from '../models/AdminCollectionsListRes';
import type { AdminCollectionsRes } from '../models/AdminCollectionsRes';
import type { AdminDeleteProductsFromCollectionReq } from '../models/AdminDeleteProductsFromCollectionReq';
import type { AdminDeleteProductsFromCollectionRes } from '../models/AdminDeleteProductsFromCollectionRes';
import type { AdminGetCollectionsParams } from '../models/AdminGetCollectionsParams';
import type { AdminPostCollectionsCollectionReq } from '../models/AdminPostCollectionsCollectionReq';
import type { AdminPostCollectionsReq } from '../models/AdminPostCollectionsReq';
import type { AdminPostProductsToCollectionReq } from '../models/AdminPostProductsToCollectionReq';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class CollectionService {

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
      url: '/collections',
      headers: customHeaders,
      query: {
        'limit': queryParams.limit,
        'offset': queryParams.offset,
        'title': queryParams.title,
        'handle': queryParams.handle,
        'q': queryParams.q,
        'discount_condition_id': queryParams.discount_condition_id,
        'created_at': queryParams.created_at,
        'updated_at': queryParams.updated_at,
        'deleted_at': queryParams.deleted_at,
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
      url: '/collections',
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
      url: '/collections/{id}',
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
      url: '/collections/{id}',
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
      url: '/collections/{id}',
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
      url: '/collections/{id}/products/batch',
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
      url: '/collections/{id}/products/batch',
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
