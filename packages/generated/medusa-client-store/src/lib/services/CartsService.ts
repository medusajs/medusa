/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import {
  StoreCartsRes,
  StoreCompleteCartRes,
  StorePostCartReq,
  StorePostCartsCartLineItemsItemReq,
  StorePostCartsCartLineItemsReq,
  StorePostCartsCartPaymentSessionReq,
  StorePostCartsCartPaymentSessionUpdateReq,
  StorePostCartsCartReq,
  StorePostCartsCartShippingMethodReq,
} from '@medusajs/client-types';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class CartsService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * PostCart
   * Create a Cart
   * Creates a Cart within the given region and with the initial items. If no `region_id` is provided the cart will be associated with the first Region available. If no items are provided the cart will be empty after creation. If a user is logged in the cart's customer id and email will be set.
   * @returns StoreCartsRes Successfully created a new Cart
   * @throws ApiError
   */
  public create(
    requestBody: StorePostCartReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<StoreCartsRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/store/carts',
      headers: customHeaders,
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        400: `Client Error or Multiple Errors`,
        404: `Not Found Error`,
        409: `Invalid State Error`,
        422: `Invalid Request Error`,
        500: `Server Error`,
      },
    });
  }

  /**
   * GetCartsCart
   * Get a Cart
   * Retrieves a Cart.
   * @returns StoreCartsRes OK
   * @throws ApiError
   */
  public retrieve(
    id: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<StoreCartsRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/store/carts/{id}',
      path: {
        'id': id,
      },
      headers: customHeaders,
      errors: {
        400: `Client Error or Multiple Errors`,
        404: `Not Found Error`,
        409: `Invalid State Error`,
        422: `Invalid Request Error`,
        500: `Server Error`,
      },
    });
  }

  /**
   * PostCartsCart
   * Update a Cart
   * Updates a Cart.
   * @returns StoreCartsRes OK
   * @throws ApiError
   */
  public update(
    id: string,
    requestBody: StorePostCartsCartReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<StoreCartsRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/store/carts/{id}',
      path: {
        'id': id,
      },
      headers: customHeaders,
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        400: `Client Error or Multiple Errors`,
        404: `Not Found Error`,
        409: `Invalid State Error`,
        422: `Invalid Request Error`,
        500: `Server Error`,
      },
    });
  }

  /**
   * PostCartsCartComplete
   * Complete a Cart
   * Completes a cart. The following steps will be performed. Payment authorization is attempted and if more work is required, we simply return the cart for further updates. If payment is authorized and order is not yet created, we make sure to do so. The completion of a cart can be performed idempotently with a provided header `Idempotency-Key`. If not provided, we will generate one for the request.
   * @returns StoreCompleteCartRes If a cart was successfully authorized, but requires further action from the user the response body will contain the cart with an updated payment session. If the Cart was successfully completed the response body will contain the newly created Order.
   * @throws ApiError
   */
  public complete(
    id: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<StoreCompleteCartRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/store/carts/{id}/complete',
      path: {
        'id': id,
      },
      headers: customHeaders,
      errors: {
        400: `Client Error or Multiple Errors`,
        404: `Not Found Error`,
        409: `Invalid State Error`,
        422: `Invalid Request Error`,
        500: `Server Error`,
      },
    });
  }

  /**
   * DeleteCartsCartDiscountsDiscount
   * Remove Discount
   * Removes a Discount from a Cart.
   * @returns StoreCartsRes OK
   * @throws ApiError
   */
  public deleteDiscount(
    id: string,
    code: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<StoreCartsRes> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/store/carts/{id}/discounts/{code}',
      path: {
        'id': id,
        'code': code,
      },
      headers: customHeaders,
      errors: {
        400: `Client Error or Multiple Errors`,
        404: `Not Found Error`,
        409: `Invalid State Error`,
        422: `Invalid Request Error`,
        500: `Server Error`,
      },
    });
  }

  /**
   * PostCartsCartLineItems
   * Add a Line Item
   * Generates a Line Item with a given Product Variant and adds it to the Cart
   * @returns StoreCartsRes OK
   * @throws ApiError
   */
  public createLineItem(
    id: string,
    requestBody: StorePostCartsCartLineItemsReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<StoreCartsRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/store/carts/{id}/line-items',
      path: {
        'id': id,
      },
      headers: customHeaders,
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        400: `Client Error or Multiple Errors`,
        404: `Not Found Error`,
        409: `Invalid State Error`,
        422: `Invalid Request Error`,
        500: `Server Error`,
      },
    });
  }

  /**
   * PostCartsCartLineItemsItem
   * Update a Line Item
   * Updates a Line Item if the desired quantity can be fulfilled.
   * @returns StoreCartsRes OK
   * @throws ApiError
   */
  public updateLineItem(
    id: string,
    lineId: string,
    requestBody: StorePostCartsCartLineItemsItemReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<StoreCartsRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/store/carts/{id}/line-items/{line_id}',
      path: {
        'id': id,
        'line_id': lineId,
      },
      headers: customHeaders,
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        400: `Client Error or Multiple Errors`,
        404: `Not Found Error`,
        409: `Invalid State Error`,
        422: `Invalid Request Error`,
        500: `Server Error`,
      },
    });
  }

  /**
   * DeleteCartsCartLineItemsItem
   * Delete a Line Item
   * Removes a Line Item from a Cart.
   * @returns StoreCartsRes OK
   * @throws ApiError
   */
  public deleteLineItem(
    id: string,
    lineId: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<StoreCartsRes> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/store/carts/{id}/line-items/{line_id}',
      path: {
        'id': id,
        'line_id': lineId,
      },
      headers: customHeaders,
      errors: {
        400: `Client Error or Multiple Errors`,
        404: `Not Found Error`,
        409: `Invalid State Error`,
        422: `Invalid Request Error`,
        500: `Server Error`,
      },
    });
  }

  /**
   * PostCartsCartPaymentSession
   * Select a Payment Session
   * Selects a Payment Session as the session intended to be used towards the completion of the Cart.
   * @returns StoreCartsRes OK
   * @throws ApiError
   */
  public setPaymentSession(
    id: string,
    requestBody: StorePostCartsCartPaymentSessionReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<StoreCartsRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/store/carts/{id}/payment-session',
      path: {
        'id': id,
      },
      headers: customHeaders,
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        400: `Client Error or Multiple Errors`,
        404: `Not Found Error`,
        409: `Invalid State Error`,
        422: `Invalid Request Error`,
        500: `Server Error`,
      },
    });
  }

  /**
   * PostCartsCartPaymentSessions
   * Create Payment Sessions
   * Creates Payment Sessions for each of the available Payment Providers in the Cart's Region.
   * @returns StoreCartsRes OK
   * @throws ApiError
   */
  public createPaymentSessions(
    id: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<StoreCartsRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/store/carts/{id}/payment-sessions',
      path: {
        'id': id,
      },
      headers: customHeaders,
      errors: {
        400: `Client Error or Multiple Errors`,
        404: `Not Found Error`,
        409: `Invalid State Error`,
        422: `Invalid Request Error`,
        500: `Server Error`,
      },
    });
  }

  /**
   * PostCartsCartPaymentSessionUpdate
   * Update a Payment Session
   * Updates a Payment Session with additional data.
   * @returns StoreCartsRes OK
   * @throws ApiError
   */
  public updatePaymentSession(
    id: string,
    providerId: string,
    requestBody: StorePostCartsCartPaymentSessionUpdateReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<StoreCartsRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/store/carts/{id}/payment-sessions/{provider_id}',
      path: {
        'id': id,
        'provider_id': providerId,
      },
      headers: customHeaders,
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        400: `Client Error or Multiple Errors`,
        404: `Not Found Error`,
        409: `Invalid State Error`,
        422: `Invalid Request Error`,
        500: `Server Error`,
      },
    });
  }

  /**
   * DeleteCartsCartPaymentSessionsSession
   * Delete a Payment Session
   * Deletes a Payment Session on a Cart. May be useful if a payment has failed.
   * @returns StoreCartsRes OK
   * @throws ApiError
   */
  public deletePaymentSession(
    id: string,
    providerId: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<StoreCartsRes> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/store/carts/{id}/payment-sessions/{provider_id}',
      path: {
        'id': id,
        'provider_id': providerId,
      },
      headers: customHeaders,
      errors: {
        400: `Client Error or Multiple Errors`,
        404: `Not Found Error`,
        409: `Invalid State Error`,
        422: `Invalid Request Error`,
        500: `Server Error`,
      },
    });
  }

  /**
   * PostCartsCartPaymentSessionsSession
   * Refresh a Payment Session
   * Refreshes a Payment Session to ensure that it is in sync with the Cart - this is usually not necessary.
   * @returns StoreCartsRes OK
   * @throws ApiError
   */
  public refreshPaymentSession(
    id: string,
    providerId: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<StoreCartsRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/store/carts/{id}/payment-sessions/{provider_id}/refresh',
      path: {
        'id': id,
        'provider_id': providerId,
      },
      headers: customHeaders,
      errors: {
        400: `Client Error or Multiple Errors`,
        404: `Not Found Error`,
        409: `Invalid State Error`,
        422: `Invalid Request Error`,
        500: `Server Error`,
      },
    });
  }

  /**
   * PostCartsCartShippingMethod
   * Add a Shipping Method
   * Adds a Shipping Method to the Cart.
   * @returns StoreCartsRes OK
   * @throws ApiError
   */
  public addShippingMethod(
    id: string,
    requestBody: StorePostCartsCartShippingMethodReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<StoreCartsRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/store/carts/{id}/shipping-methods',
      path: {
        'id': id,
      },
      headers: customHeaders,
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        400: `Client Error or Multiple Errors`,
        404: `Not Found Error`,
        409: `Invalid State Error`,
        422: `Invalid Request Error`,
        500: `Server Error`,
      },
    });
  }

  /**
   * PostCartsCartTaxes
   * Calculate Cart Taxes
   * Calculates taxes for a cart. Depending on the cart's region this may involve making 3rd party API calls to a Tax Provider service.
   * @returns StoreCartsRes OK
   * @throws ApiError
   */
  public calculateTaxes(
    id: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<StoreCartsRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/store/carts/{id}/taxes',
      path: {
        'id': id,
      },
      headers: customHeaders,
      errors: {
        400: `Client Error or Multiple Errors`,
        404: `Not Found Error`,
        409: `Invalid State Error`,
        422: `Invalid Request Error`,
        500: `Server Error`,
      },
    });
  }

}
