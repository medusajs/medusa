/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdminGetOrdersOrderParams } from '../models/AdminGetOrdersOrderParams';
import type { AdminGetOrdersParams } from '../models/AdminGetOrdersParams';
import type { AdminOrdersListRes } from '../models/AdminOrdersListRes';
import type { AdminOrdersRes } from '../models/AdminOrdersRes';
import type { AdminPostOrdersOrderRefundsReq } from '../models/AdminPostOrdersOrderRefundsReq';
import type { AdminPostOrdersOrderReq } from '../models/AdminPostOrdersOrderReq';
import type { AdminPostOrdersOrderReturnsReq } from '../models/AdminPostOrdersOrderReturnsReq';
import type { AdminPostOrdersOrderShipmentReq } from '../models/AdminPostOrdersOrderShipmentReq';
import type { AdminPostOrdersOrderShippingMethodsReq } from '../models/AdminPostOrdersOrderShippingMethodsReq';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class OrderService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * GetOrders
   * List Orders
   * Retrieves a list of Orders
   * @returns AdminOrdersListRes OK
   * @throws ApiError
   */
  public list(
    queryParams: AdminGetOrdersParams,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminOrdersListRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/orders',
      headers: customHeaders,
      query: {
        'q': queryParams.q,
        'id': queryParams.id,
        'status': queryParams.status,
        'fulfillment_status': queryParams.fulfillmentStatus,
        'payment_status': queryParams.paymentStatus,
        'display_id': queryParams.displayId,
        'cart_id': queryParams.cartId,
        'customer_id': queryParams.customerId,
        'email': queryParams.email,
        'region_id': queryParams.regionId,
        'currency_code': queryParams.currencyCode,
        'tax_rate': queryParams.taxRate,
        'created_at': queryParams.createdAt,
        'updated_at': queryParams.updatedAt,
        'canceled_at': queryParams.canceledAt,
        'sales_channel_id': queryParams.salesChannelId,
        'offset': queryParams.offset,
        'limit': queryParams.limit,
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
   * GetOrdersOrder
   * Get an Order
   * Retrieves an Order
   * @returns AdminOrdersRes OK
   * @throws ApiError
   */
  public retrieve(
    id: string,
    queryParams: AdminGetOrdersOrderParams,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminOrdersRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/orders/{id}',
      path: {
        'id': id,
      },
      headers: customHeaders,
      query: {
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
   * PostOrdersOrder
   * Update an Order
   * Updates and order
   * @returns AdminOrdersRes OK
   * @throws ApiError
   */
  public update(
    id: string,
    requestBody: AdminPostOrdersOrderReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminOrdersRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/orders/{id}',
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
   * PostOrdersOrderArchive
   * Archive Order
   * Archives the order with the given id.
   * @returns AdminOrdersRes OK
   * @throws ApiError
   */
  public archive(
    id: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminOrdersRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/orders/{id}/archive',
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
   * PostOrdersOrderCancel
   * Cancel an Order
   * Registers an Order as canceled. This triggers a flow that will cancel any created Fulfillments and Payments, may fail if the Payment or Fulfillment Provider is unable to cancel the Payment/Fulfillment.
   * @returns AdminOrdersRes OK
   * @throws ApiError
   */
  public cancel(
    id: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminOrdersRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/orders/{id}/cancel',
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
   * PostOrdersOrderCapture
   * Capture Order's Payment
   * Captures all the Payments associated with an Order.
   * @returns AdminOrdersRes OK
   * @throws ApiError
   */
  public capturePayment(
    id: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminOrdersRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/orders/{id}/capture',
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
   * PostOrdersOrderComplete
   * Complete an Order
   * Completes an Order
   * @returns AdminOrdersRes OK
   * @throws ApiError
   */
  public complete(
    id: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminOrdersRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/orders/{id}/complete',
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
   * PostOrdersOrderRefunds
   * Create a Refund
   * Issues a Refund.
   * @returns AdminOrdersRes OK
   * @throws ApiError
   */
  public refundPayment(
    id: string,
    requestBody: AdminPostOrdersOrderRefundsReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminOrdersRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/orders/{id}/refund',
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
   * PostOrdersOrderReturns
   * Request a Return
   * Requests a Return. If applicable a return label will be created and other plugins notified.
   * @returns AdminOrdersRes OK
   * @throws ApiError
   */
  public requestReturn(
    id: string,
    requestBody: AdminPostOrdersOrderReturnsReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminOrdersRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/orders/{id}/return',
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
   * PostOrdersOrderShipment
   * Create a Shipment
   * Registers a Fulfillment as shipped.
   * @returns AdminOrdersRes OK
   * @throws ApiError
   */
  public createShipment(
    id: string,
    requestBody: AdminPostOrdersOrderShipmentReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminOrdersRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/orders/{id}/shipment',
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
   * PostOrdersOrderShippingMethods
   * Add a Shipping Method
   * Adds a Shipping Method to an Order. If another Shipping Method exists with the same Shipping Profile, the previous Shipping Method will be replaced.
   * @returns AdminOrdersRes OK
   * @throws ApiError
   */
  public addShippingMethod(
    id: string,
    requestBody: AdminPostOrdersOrderShippingMethodsReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminOrdersRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/orders/{id}/shipping-methods',
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
