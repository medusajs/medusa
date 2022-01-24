import {
  AdminPostOrdersOrderReq,
  AdminOrdersRes,
  AdminGetOrdersParams,
  AdminOrdersListRes,
  AdminPostOrdersReq,
  AdminPostOrdersOrderRefundsReq,
  AdminPostOrdersOrderFulfillmentsReq,
  AdminPostOrdersOrderShipmentReq,
  AdminPostOrdersOrderReturnsReq,
  AdminPostOrdersOrderShippingMethodsReq,
  AdminPostOrdersOrderSwapsReq,
  AdminPostOrdersOrderSwapsSwapReceiveReq,
  AdminPostOrdersOrderSwapsSwapFulfillmentsReq,
  AdminPostOrdersOrderSwapsSwapShipmentsReq,
  AdminPostOrdersOrderClaimsReq,
  AdminPostOrdersOrderClaimsClaimFulfillmentsReq,
  AdminPostOrdersOrderClaimsClaimShipmentsReq,
  AdminPostOrdersOrderClaimsClaimReq,
} from "@medusajs/medusa"
import qs from "qs"
import { ResponsePromise } from "../../typings"
import BaseResource from "../base"

class AdminOrdersResource extends BaseResource {
  create(payload: AdminPostOrdersReq, customHeaders: object = {}): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  update(
    id: string,
    payload: AdminPostOrdersOrderReq,
    customHeaders: object = {}): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  retrieve(id: string, customHeaders: object = {}): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}`
    return this.client.request("GET", path, {}, {}, customHeaders)
  }

  list(query?: AdminGetOrdersParams, customHeaders: object = {}): ResponsePromise<AdminOrdersListRes> {
    let path = `/admin/orders`

    if (query) {
      const queryString = qs.stringify(query)
      path = `/admin/orders?${queryString}`
    }

    return this.client.request("GET", path, {}, {}, customHeaders)
  }

  complete(id: string, customHeaders: object = {}): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/complete`
    return this.client.request("POST", path, {}, {}, customHeaders)
  }

  capturePayment(id: string, customHeaders: object = {}): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/capture`
    return this.client.request("POST", path, {}, {}, customHeaders)
  }

  refundPayment(
    id: string,
    payload: AdminPostOrdersOrderRefundsReq,
    customHeaders: object = {}): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/refund`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  createFulfillment(
    id: string,
    payload: AdminPostOrdersOrderFulfillmentsReq,
    customHeaders: object = {}): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/fulfillment`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  cancelFulfillment(
    id: string,
    fulfillmentId: string,
    customHeaders: object = {}
  ): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/fulfillments/${fulfillmentId}/cancel`
    return this.client.request("POST", path, {}, {}, customHeaders)
  }

  cancelSwapFulfillment(
    id: string,
    swapId: string,
    fulfillmentId: string,
    customHeaders: object = {}
  ): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/swaps/${swapId}/fulfillments/${fulfillmentId}/cancel`
    return this.client.request("POST", path, {}, {}, customHeaders)
  }

  cancelClaimFulfillment(
    id: string,
    claimId: string,
    fulfillmentId: string,
    customHeaders: object = {}
  ): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/claims/${claimId}/fulfillments/${fulfillmentId}/cancel`
    return this.client.request("POST", path, {}, {}, customHeaders)
  }

  createShipment(
    id: string,
    payload: AdminPostOrdersOrderShipmentReq,
    customHeaders: object = {}
  ): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/shipment`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  requestReturn(
    id: string,
    payload: AdminPostOrdersOrderReturnsReq,
    customHeaders: object = {}
  ): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/return`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  cancel(id: string, customHeaders: object = {}): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/cancel`
    return this.client.request("POST", path, {}, {}, customHeaders)
  }

  addShippingMethod(
    id: string,
    payload: AdminPostOrdersOrderShippingMethodsReq,
    customHeaders: object = {}
  ): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/shipping-methods`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  archive(id: string, customHeaders: object = {}): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/archive`
    return this.client.request("POST", path, {}, {}, customHeaders)
  }

  createSwap(
    id: string,
    payload: AdminPostOrdersOrderSwapsReq,
    customHeaders: object = {}
  ): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/swaps`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  cancelSwap(id: string, swapId: string, customHeaders: object = {}): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/swaps/${swapId}/cancel`
    return this.client.request("POST", path, {}, {}, customHeaders)
  }

  receiveSwap(
    id: string,
    swapId: string,
    payload: AdminPostOrdersOrderSwapsSwapReceiveReq,
    customHeaders: object = {}
  ): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/swaps/${swapId}/receive`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  fulfillSwap(
    id: string,
    swapId: string,
    payload: AdminPostOrdersOrderSwapsSwapFulfillmentsReq,
    customHeaders: object = {}
  ): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/swaps/${swapId}/fulfillments`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  createSwapShipment(
    id: string,
    swapId: string,
    payload: AdminPostOrdersOrderSwapsSwapShipmentsReq,
    customHeaders: object = {}
  ): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/swaps/${swapId}/shipments`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  processSwapPayment(
    id: string,
    swapId: string,
    customHeaders: object = {}
  ): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/swaps/${swapId}/process-payment`
    return this.client.request("POST", path, {}, {}, customHeaders)
  }

  createClaim(
    id: string,
    payload: AdminPostOrdersOrderClaimsReq,
    customHeaders: object = {}
  ): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/claims`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  cancelClaim(id: string, claimId: string, customHeaders: object = {}): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/claims/${claimId}/cancel`
    return this.client.request("POST", path, {}, {}, customHeaders)
  }

  updateClaim(
    id: string,
    claimId: string,
    payload: AdminPostOrdersOrderClaimsClaimReq,
    customHeaders: object = {}
  ): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/claims/${claimId}`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  fulfillClaim(
    id: string,
    claimId: string,
    payload: AdminPostOrdersOrderClaimsClaimFulfillmentsReq,
    customHeaders: object = {}
  ): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/claims/${claimId}/fulfillments`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  createClaimShipment(
    id: string,
    claimId: string,
    payload: AdminPostOrdersOrderClaimsClaimShipmentsReq,
    customHeaders: object = {}
  ): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/claims/${claimId}/shipments`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  deleteMetadata(id: string, key: string, customHeaders: object = {}): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/metadata/${key}`
    return this.client.request("DELETE", path, {}, {}, customHeaders)
  }
}

export default AdminOrdersResource
