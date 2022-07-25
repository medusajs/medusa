import {
  AdminGetOrdersParams,
  AdminOrdersListRes,
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
  AdminPostOrdersOrderSwapsReq,
  AdminPostOrdersOrderSwapsSwapFulfillmentsReq,
  AdminPostOrdersOrderSwapsSwapShipmentsReq,
  AdminPostOrdersReq,
} from "@medusajs/medusa"
import qs from "qs"
import { ResponsePromise } from "../../typings"
import BaseResource from "../base"

class AdminOrdersResource extends BaseResource {
  create(
    payload: AdminPostOrdersReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  update(
    id: string,
    payload: AdminPostOrdersOrderReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  retrieve(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}`
    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  list(
    query?: AdminGetOrdersParams,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminOrdersListRes> {
    let path = `/admin/orders`

    if (query) {
      const queryString = qs.stringify(query)
      path = `/admin/orders?${queryString}`
    }

    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  complete(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/complete`
    return this.client.request("POST", path, undefined, {}, customHeaders)
  }

  capturePayment(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/capture`
    return this.client.request("POST", path, undefined, {}, customHeaders)
  }

  refundPayment(
    id: string,
    payload: AdminPostOrdersOrderRefundsReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/refund`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  createFulfillment(
    id: string,
    payload: AdminPostOrdersOrderFulfillmentsReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/fulfillment`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  cancelFulfillment(
    id: string,
    fulfillmentId: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/fulfillments/${fulfillmentId}/cancel`
    return this.client.request("POST", path, undefined, {}, customHeaders)
  }

  cancelSwapFulfillment(
    id: string,
    swapId: string,
    fulfillmentId: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/swaps/${swapId}/fulfillments/${fulfillmentId}/cancel`
    return this.client.request("POST", path, undefined, {}, customHeaders)
  }

  cancelClaimFulfillment(
    id: string,
    claimId: string,
    fulfillmentId: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/claims/${claimId}/fulfillments/${fulfillmentId}/cancel`
    return this.client.request("POST", path, undefined, {}, customHeaders)
  }

  createShipment(
    id: string,
    payload: AdminPostOrdersOrderShipmentReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/shipment`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  requestReturn(
    id: string,
    payload: AdminPostOrdersOrderReturnsReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/return`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  cancel(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/cancel`
    return this.client.request("POST", path, undefined, {}, customHeaders)
  }

  addShippingMethod(
    id: string,
    payload: AdminPostOrdersOrderShippingMethodsReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/shipping-methods`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  archive(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/archive`
    return this.client.request("POST", path, undefined, {}, customHeaders)
  }

  createSwap(
    id: string,
    payload: AdminPostOrdersOrderSwapsReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/swaps`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  cancelSwap(
    id: string,
    swapId: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/swaps/${swapId}/cancel`
    return this.client.request("POST", path, undefined, {}, customHeaders)
  }

  fulfillSwap(
    id: string,
    swapId: string,
    payload: AdminPostOrdersOrderSwapsSwapFulfillmentsReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/swaps/${swapId}/fulfillments`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  createSwapShipment(
    id: string,
    swapId: string,
    payload: AdminPostOrdersOrderSwapsSwapShipmentsReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/swaps/${swapId}/shipments`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  processSwapPayment(
    id: string,
    swapId: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/swaps/${swapId}/process-payment`
    return this.client.request("POST", path, undefined, {}, customHeaders)
  }

  createClaim(
    id: string,
    payload: AdminPostOrdersOrderClaimsReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/claims`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  cancelClaim(
    id: string,
    claimId: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/claims/${claimId}/cancel`
    return this.client.request("POST", path, undefined, {}, customHeaders)
  }

  updateClaim(
    id: string,
    claimId: string,
    payload: AdminPostOrdersOrderClaimsClaimReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/claims/${claimId}`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  fulfillClaim(
    id: string,
    claimId: string,
    payload: AdminPostOrdersOrderClaimsClaimFulfillmentsReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/claims/${claimId}/fulfillments`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  createClaimShipment(
    id: string,
    claimId: string,
    payload: AdminPostOrdersOrderClaimsClaimShipmentsReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/claims/${claimId}/shipments`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  deleteMetadata(
    id: string,
    key: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/metadata/${key}`
    return this.client.request("DELETE", path, undefined, {}, customHeaders)
  }
}

export default AdminOrdersResource
