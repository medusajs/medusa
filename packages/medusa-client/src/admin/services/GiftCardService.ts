/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdminGetGiftCardsParams } from '../models/AdminGetGiftCardsParams';
import type { AdminGiftCardsDeleteRes } from '../models/AdminGiftCardsDeleteRes';
import type { AdminGiftCardsListRes } from '../models/AdminGiftCardsListRes';
import type { AdminGiftCardsRes } from '../models/AdminGiftCardsRes';
import type { AdminPostGiftCardsGiftCardReq } from '../models/AdminPostGiftCardsGiftCardReq';
import type { AdminPostGiftCardsReq } from '../models/AdminPostGiftCardsReq';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class GiftCardService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * GetGiftCards
   * List Gift Cards
   * Retrieves a list of Gift Cards.
   * @returns AdminGiftCardsListRes OK
   * @throws ApiError
   */
  public list(
    queryParams: AdminGetGiftCardsParams,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminGiftCardsListRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/gift-cards',
      headers: customHeaders,
      query: {
        'offset': queryParams.offset,
        'limit': queryParams.limit,
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
   * PostGiftCards
   * Create a Gift Card
   * Creates a Gift Card that can redeemed by its unique code. The Gift Card is only valid within 1 region.
   * @returns AdminGiftCardsRes OK
   * @throws ApiError
   */
  public create(
    requestBody: AdminPostGiftCardsReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminGiftCardsRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/gift-cards',
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
   * GetGiftCardsGiftCard
   * Get a Gift Card
   * Retrieves a Gift Card.
   * @returns AdminGiftCardsRes OK
   * @throws ApiError
   */
  public retrieve(
    id: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminGiftCardsRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/gift-cards/{id}',
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
   * PostGiftCardsGiftCard
   * Update a Gift Card
   * Update a Gift Card that can redeemed by its unique code. The Gift Card is only valid within 1 region.
   * @returns AdminGiftCardsRes OK
   * @throws ApiError
   */
  public update(
    id: string,
    requestBody: AdminPostGiftCardsGiftCardReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminGiftCardsRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/gift-cards/{id}',
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
   * DeleteGiftCardsGiftCard
   * Delete a Gift Card
   * Deletes a Gift Card
   * @returns AdminGiftCardsDeleteRes OK
   * @throws ApiError
   */
  public delete(
    id: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminGiftCardsDeleteRes> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/gift-cards/{id}',
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
