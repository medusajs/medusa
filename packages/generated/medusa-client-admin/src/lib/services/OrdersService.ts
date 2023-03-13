/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import {
  AdminGetOrdersOrderParams,
  AdminGetOrdersParams,
  AdminOrdersListRes,
  AdminOrdersOrderLineItemReservationReq,
  AdminOrdersRes,
  AdminPostOrdersOrderClaimsClaimFulfillmentsReq,
  AdminPostOrdersOrderClaimsClaimReq,
  AdminPostOrdersOrderClaimsClaimShipmentsReq,
  AdminPostOrdersOrderClaimsReq,
  AdminPostOrdersOrderFulfillmentsReq,
  AdminPostOrdersOrderRefundsReq,
  AdminPostOrdersOrderReq,
  AdminPostOrdersOrderReturnsReq,
  AdminPostOrdersOrderShipmentReq,
  AdminPostOrdersOrderShippingMethodsReq,
  AdminPostOrdersOrderSwapsParams,
  AdminPostOrdersOrderSwapsReq,
  AdminPostOrdersOrderSwapsSwapFulfillmentsReq,
  AdminPostOrdersOrderSwapsSwapShipmentsReq,
  AdminPostReservationsReq,
  AdminReservationsListRes,
} from '@medusajs/client-types';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class OrdersService {

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
      url: '/admin/orders',
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
      url: '/admin/orders/{id}',
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
   * PostOrdersOrder
   * Update an Order
   * Updates and order
   * @returns AdminOrdersRes OK
   * @throws ApiError
   */
  public update(
    id: string,
    requestBody: AdminPostOrdersOrderReq,
    queryParams: {
      /**
       * Comma separated list of relations to include in the result.
       */
      expand?: string,
      /**
       * Comma separated list of fields to include in the result.
       */
      fields?: string,
    },
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminOrdersRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/admin/orders/{id}',
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
   * PostOrdersOrderArchive
   * Archive Order
   * Archives the order with the given id.
   * @returns AdminOrdersRes OK
   * @throws ApiError
   */
  public archive(
    id: string,
    queryParams: {
      /**
       * Comma separated list of relations to include in the result.
       */
      expand?: string,
      /**
       * Comma separated list of fields to include in the result.
       */
      fields?: string,
    },
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminOrdersRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/admin/orders/{id}/archive',
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
   * PostOrdersOrderCancel
   * Cancel an Order
   * Registers an Order as canceled. This triggers a flow that will cancel any created Fulfillments and Payments, may fail if the Payment or Fulfillment Provider is unable to cancel the Payment/Fulfillment.
   * @returns AdminOrdersRes OK
   * @throws ApiError
   */
  public cancel(
    id: string,
    queryParams: {
      /**
       * Comma separated list of relations to include in the result.
       */
      expand?: string,
      /**
       * Comma separated list of fields to include in the result.
       */
      fields?: string,
    },
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminOrdersRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/admin/orders/{id}/cancel',
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
   * PostOrdersOrderCapture
   * Capture Order's Payment
   * Captures all the Payments associated with an Order.
   * @returns AdminOrdersRes OK
   * @throws ApiError
   */
  public capturePayment(
    id: string,
    queryParams: {
      /**
       * Comma separated list of relations to include in the result.
       */
      expand?: string,
      /**
       * Comma separated list of fields to include in the result.
       */
      fields?: string,
    },
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminOrdersRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/admin/orders/{id}/capture',
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
   * PostOrdersOrderClaims
   * Create a Claim
   * Creates a Claim.
   * @returns AdminOrdersRes OK
   * @throws ApiError
   */
  public createClaim(
    id: string,
    requestBody: AdminPostOrdersOrderClaimsReq,
    queryParams: {
      /**
       * Comma separated list of relations to include in the result.
       */
      expand?: string,
      /**
       * Comma separated list of fields to include in the result.
       */
      fields?: string,
    },
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminOrdersRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/admin/orders/{id}/claims',
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
   * PostOrdersOrderClaimsClaim
   * Update a Claim
   * Updates a Claim.
   * @returns AdminOrdersRes OK
   * @throws ApiError
   */
  public updateClaim(
    id: string,
    claimId: string,
    requestBody: AdminPostOrdersOrderClaimsClaimReq,
    queryParams: {
      /**
       * Comma separated list of relations to include in the result.
       */
      expand?: string,
      /**
       * Comma separated list of fields to include in the result.
       */
      fields?: string,
    },
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminOrdersRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/admin/orders/{id}/claims/{claim_id}',
      path: {
        'id': id,
        'claim_id': claimId,
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
   * PostOrdersClaimCancel
   * Cancel a Claim
   * Cancels a Claim
   * @returns AdminOrdersRes OK
   * @throws ApiError
   */
  public cancelClaim(
    id: string,
    claimId: string,
    queryParams: {
      /**
       * Comma separated list of relations to include in the result.
       */
      expand?: string,
      /**
       * Comma separated list of fields to include in the result.
       */
      fields?: string,
    },
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminOrdersRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/admin/orders/{id}/claims/{claim_id}/cancel',
      path: {
        'id': id,
        'claim_id': claimId,
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
   * PostOrdersOrderClaimsClaimFulfillments
   * Create Claim Fulfillment
   * Creates a Fulfillment for a Claim.
   * @returns AdminOrdersRes OK
   * @throws ApiError
   */
  public fulfillClaim(
    id: string,
    claimId: string,
    requestBody: AdminPostOrdersOrderClaimsClaimFulfillmentsReq,
    queryParams: {
      /**
       * Comma separated list of relations to include in the result.
       */
      expand?: string,
      /**
       * Comma separated list of fields to include in the result.
       */
      fields?: string,
    },
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminOrdersRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/admin/orders/{id}/claims/{claim_id}/fulfillments',
      path: {
        'id': id,
        'claim_id': claimId,
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
   * PostOrdersClaimFulfillmentsCancel
   * Cancel Claim Fulfillment
   * Registers a claim's fulfillment as canceled.
   * @returns AdminOrdersRes OK
   * @throws ApiError
   */
  public cancelClaimFulfillment(
    id: string,
    claimId: string,
    fulfillmentId: string,
    queryParams: {
      /**
       * Comma separated list of relations to include in the result.
       */
      expand?: string,
      /**
       * Comma separated list of fields to include in the result.
       */
      fields?: string,
    },
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminOrdersRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/admin/orders/{id}/claims/{claim_id}/fulfillments/{fulfillment_id}/cancel',
      path: {
        'id': id,
        'claim_id': claimId,
        'fulfillment_id': fulfillmentId,
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
   * PostOrdersOrderClaimsClaimShipments
   * Create Claim Shipment
   * Registers a Claim Fulfillment as shipped.
   * @returns AdminOrdersRes OK
   * @throws ApiError
   */
  public createClaimShipment(
    id: string,
    claimId: string,
    requestBody: AdminPostOrdersOrderClaimsClaimShipmentsReq,
    queryParams: {
      /**
       * Comma separated list of relations to include in the result.
       */
      expand?: string,
      /**
       * Comma separated list of fields to include in the result.
       */
      fields?: string,
    },
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminOrdersRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/admin/orders/{id}/claims/{claim_id}/shipments',
      path: {
        'id': id,
        'claim_id': claimId,
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
   * PostOrdersOrderComplete
   * Complete an Order
   * Completes an Order
   * @returns AdminOrdersRes OK
   * @throws ApiError
   */
  public complete(
    id: string,
    queryParams: {
      /**
       * Comma separated list of relations to include in the result.
       */
      expand?: string,
      /**
       * Comma separated list of fields to include in the result.
       */
      fields?: string,
    },
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminOrdersRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/admin/orders/{id}/complete',
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
   * PostOrdersOrderFulfillments
   * Create a Fulfillment
   * Creates a Fulfillment of an Order - will notify Fulfillment Providers to prepare a shipment.
   * @returns AdminOrdersRes OK
   * @throws ApiError
   */
  public createFulfillment(
    id: string,
    requestBody: AdminPostOrdersOrderFulfillmentsReq,
    queryParams: {
      /**
       * Comma separated list of relations to include in the result.
       */
      expand?: string,
      /**
       * Comma separated list of fields to include in the result.
       */
      fields?: string,
    },
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminOrdersRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/admin/orders/{id}/fulfillment',
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
   * PostOrdersOrderFulfillmentsCancel
   * Cancels a Fulfilmment
   * Registers a Fulfillment as canceled.
   * @returns AdminOrdersRes OK
   * @throws ApiError
   */
  public cancelFulfillment(
    id: string,
    fulfillmentId: string,
    queryParams: {
      /**
       * Comma separated list of relations to include in the result.
       */
      expand?: string,
      /**
       * Comma separated list of fields to include in the result.
       */
      fields?: string,
    },
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminOrdersRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/admin/orders/{id}/fulfillments/{fulfillment_id}/cancel',
      path: {
        'id': id,
        'fulfillment_id': fulfillmentId,
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
   * PostOrdersOrderLineItemReservations
   * Create a Reservation for a line item
   * Creates a Reservation for a line item at a specified location, optionally for a partial quantity.
   * @returns AdminPostReservationsReq OK
   * @throws ApiError
   */
  public postOrdersOrderLineItemReservations(
    id: string,
    lineItemId: string,
    requestBody: AdminOrdersOrderLineItemReservationReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminPostReservationsReq> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/admin/orders/{id}/line-items/{line_item_id}/reserve',
      path: {
        'id': id,
        'line_item_id': lineItemId,
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
   * PostOrdersOrderRefunds
   * Create a Refund
   * Issues a Refund.
   * @returns AdminOrdersRes OK
   * @throws ApiError
   */
  public refundPayment(
    id: string,
    requestBody: AdminPostOrdersOrderRefundsReq,
    queryParams: {
      /**
       * Comma separated list of relations to include in the result.
       */
      expand?: string,
      /**
       * Comma separated list of fields to include in the result.
       */
      fields?: string,
    },
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminOrdersRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/admin/orders/{id}/refund',
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
   * GetOrdersOrderReservations
   * Get reservations for an Order
   * Retrieves reservations for an Order
   * @returns AdminReservationsListRes OK
   * @throws ApiError
   */
  public getOrdersOrderReservations(
    id: string,
    queryParams: {
      /**
       * How many reservations to skip before the results.
       */
      offset?: number,
      /**
       * Limit the number of reservations returned.
       */
      limit?: number,
    },
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminReservationsListRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/admin/orders/{id}/reservations',
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
   * PostOrdersOrderReturns
   * Request a Return
   * Requests a Return. If applicable a return label will be created and other plugins notified.
   * @returns AdminOrdersRes OK
   * @throws ApiError
   */
  public requestReturn(
    id: string,
    requestBody: AdminPostOrdersOrderReturnsReq,
    queryParams: {
      /**
       * Comma separated list of relations to include in the result.
       */
      expand?: string,
      /**
       * Comma separated list of fields to include in the result.
       */
      fields?: string,
    },
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminOrdersRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/admin/orders/{id}/return',
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
   * PostOrdersOrderShipment
   * Create a Shipment
   * Registers a Fulfillment as shipped.
   * @returns AdminOrdersRes OK
   * @throws ApiError
   */
  public createShipment(
    id: string,
    requestBody: AdminPostOrdersOrderShipmentReq,
    queryParams: {
      /**
       * Comma separated list of relations to include in the result.
       */
      expand?: string,
      /**
       * Comma separated list of fields to include in the result.
       */
      fields?: string,
    },
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminOrdersRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/admin/orders/{id}/shipment',
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
   * PostOrdersOrderShippingMethods
   * Add a Shipping Method
   * Adds a Shipping Method to an Order. If another Shipping Method exists with the same Shipping Profile, the previous Shipping Method will be replaced.
   * @returns AdminOrdersRes OK
   * @throws ApiError
   */
  public addShippingMethod(
    id: string,
    requestBody: AdminPostOrdersOrderShippingMethodsReq,
    queryParams: {
      /**
       * Comma separated list of relations to include in the result.
       */
      expand?: string,
      /**
       * Comma separated list of fields to include in the result.
       */
      fields?: string,
    },
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminOrdersRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/admin/orders/{id}/shipping-methods',
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
   * PostOrdersOrderSwaps
   * Create a Swap
   * Creates a Swap. Swaps are used to handle Return of previously purchased goods and Fulfillment of replacements simultaneously.
   * @returns AdminOrdersRes OK
   * @throws ApiError
   */
  public createSwap(
    id: string,
    requestBody: AdminPostOrdersOrderSwapsReq,
    queryParams: AdminPostOrdersOrderSwapsParams,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminOrdersRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/admin/orders/{id}/swaps',
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
   * PostOrdersSwapCancel
   * Cancels a Swap
   * Cancels a Swap
   * @returns AdminOrdersRes OK
   * @throws ApiError
   */
  public cancelSwap(
    id: string,
    swapId: string,
    queryParams: {
      /**
       * Comma separated list of relations to include in the result.
       */
      expand?: string,
      /**
       * Comma separated list of fields to include in the result.
       */
      fields?: string,
    },
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminOrdersRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/admin/orders/{id}/swaps/{swap_id}/cancel',
      path: {
        'id': id,
        'swap_id': swapId,
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
   * PostOrdersOrderSwapsSwapFulfillments
   * Create Swap Fulfillment
   * Creates a Fulfillment for a Swap.
   * @returns AdminOrdersRes OK
   * @throws ApiError
   */
  public fulfillSwap(
    id: string,
    swapId: string,
    requestBody: AdminPostOrdersOrderSwapsSwapFulfillmentsReq,
    queryParams: {
      /**
       * Comma separated list of relations to include in the result.
       */
      expand?: string,
      /**
       * Comma separated list of fields to include in the result.
       */
      fields?: string,
    },
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminOrdersRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/admin/orders/{id}/swaps/{swap_id}/fulfillments',
      path: {
        'id': id,
        'swap_id': swapId,
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
   * PostOrdersSwapFulfillmentsCancel
   * Cancel Swap's Fulfilmment
   * Registers a Swap's Fulfillment as canceled.
   * @returns AdminOrdersRes OK
   * @throws ApiError
   */
  public cancelSwapFulfillment(
    id: string,
    swapId: string,
    fulfillmentId: string,
    queryParams: {
      /**
       * Comma separated list of relations to include in the result.
       */
      expand?: string,
      /**
       * Comma separated list of fields to include in the result.
       */
      fields?: string,
    },
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminOrdersRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/admin/orders/{id}/swaps/{swap_id}/fulfillments/{fulfillment_id}/cancel',
      path: {
        'id': id,
        'swap_id': swapId,
        'fulfillment_id': fulfillmentId,
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
   * PostOrdersOrderSwapsSwapProcessPayment
   * Process Swap Payment
   * When there are differences between the returned and shipped Products in a Swap, the difference must be processed. Either a Refund will be issued or a Payment will be captured.
   * @returns AdminOrdersRes OK
   * @throws ApiError
   */
  public processSwapPayment(
    id: string,
    swapId: string,
    queryParams: {
      /**
       * Comma separated list of relations to include in the result.
       */
      expand?: string,
      /**
       * Comma separated list of fields to include in the result.
       */
      fields?: string,
    },
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminOrdersRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/admin/orders/{id}/swaps/{swap_id}/process-payment',
      path: {
        'id': id,
        'swap_id': swapId,
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
   * PostOrdersOrderSwapsSwapShipments
   * Create Swap Shipment
   * Registers a Swap Fulfillment as shipped.
   * @returns AdminOrdersRes OK
   * @throws ApiError
   */
  public createSwapShipment(
    id: string,
    swapId: string,
    requestBody: AdminPostOrdersOrderSwapsSwapShipmentsReq,
    queryParams: {
      /**
       * Comma separated list of relations to include in the result.
       */
      expand?: string,
      /**
       * Comma separated list of fields to include in the result.
       */
      fields?: string,
    },
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminOrdersRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/admin/orders/{id}/swaps/{swap_id}/shipments',
      path: {
        'id': id,
        'swap_id': swapId,
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

}
