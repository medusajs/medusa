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
import { ResponsePromise } from "../../typings"
import BaseResource from "../base"

class AdminOrdersResource extends BaseResource {
  create(payload: AdminPostOrdersReq): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders`
    return this.client.request("POST", path, payload)
  }

  update(
    id: string,
    payload: AdminPostOrdersOrderReq
  ): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}`
    return this.client.request("POST", path, payload)
  }

  retrieve(id: string): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}`
    return this.client.request("GET", path)
  }

  list(query?: AdminGetOrdersParams): ResponsePromise<AdminOrdersListRes> {
    let path = `/admin/orders`

    if (query) {
      const queryString = Object.entries(query).map(([key, value]) => {
        return typeof value !== "undefined" ? `${key}=${value}` : ""
      })
      path = `/admin/orders?${queryString.join("&")}`
    }

    return this.client.request("GET", path)
  }

  complete(id: string): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/complete`
    return this.client.request("POST", path)
  }

  capturePayment(id: string): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/capture`
    return this.client.request("POST", path)
  }

  refundPayment(
    id: string,
    payload: AdminPostOrdersOrderRefundsReq
  ): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/refund`
    return this.client.request("POST", path, payload)
  }

  createFulfillment(
    id: string,
    payload: AdminPostOrdersOrderFulfillmentsReq
  ): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/fulfillment`
    return this.client.request("POST", path, payload)
  }

  cancelFulfillment(
    id: string,
    fulfillmentId: string
  ): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/fulfillments/${fulfillmentId}/cancel`
    return this.client.request("POST", path)
  }

  cancelSwapFulfillment(
    id: string,
    swapId: string,
    fulfillmentId: string
  ): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/swaps/${swapId}/fulfillments/${fulfillmentId}/cancel`
    return this.client.request("POST", path)
  }

  cancelClaimFulfillment(
    id: string,
    claimId: string,
    fulfillmentId: string
  ): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/claims/${claimId}/fulfillments/${fulfillmentId}/cancel`
    return this.client.request("POST", path)
  }

  createShipment(
    id: string,
    payload: AdminPostOrdersOrderShipmentReq
  ): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/shipment`
    return this.client.request("POST", path, payload)
  }

  requestReturn(
    id: string,
    payload: AdminPostOrdersOrderReturnsReq
  ): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/return`
    return this.client.request("POST", path, payload)
  }

  cancel(id: string): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/cancel`
    return this.client.request("POST", path)
  }

  addShippingMethod(
    id: string,
    payload: AdminPostOrdersOrderShippingMethodsReq
  ): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/shipping-methods`
    return this.client.request("POST", path, payload)
  }

  archive(id: string): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/archive`
    return this.client.request("POST", path)
  }

  createSwap(
    id: string,
    payload: AdminPostOrdersOrderSwapsReq
  ): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/swaps`
    return this.client.request("POST", path, payload)
  }

  cancelSwap(id: string, swapId: string): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/swaps/${swapId}/cancel`
    return this.client.request("POST", path)
  }

  receiveSwap(
    id: string,
    swapId: string,
    payload: AdminPostOrdersOrderSwapsSwapReceiveReq
  ): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/swaps/${swapId}/receive`
    return this.client.request("POST", path, payload)
  }

  fulfillSwap(
    id: string,
    swapId: string,
    payload: AdminPostOrdersOrderSwapsSwapFulfillmentsReq
  ): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/swaps/${swapId}/fulfillments`
    return this.client.request("POST", path, payload)
  }

  createSwapShipment(
    id: string,
    swapId: string,
    payload: AdminPostOrdersOrderSwapsSwapShipmentsReq
  ): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/swaps/${swapId}/shipments`
    return this.client.request("POST", path, payload)
  }

  processSwapPayment(
    id: string,
    swapId: string
  ): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/swaps/${swapId}/process-payment`
    return this.client.request("POST", path)
  }

  createClaim(
    id: string,
    payload: AdminPostOrdersOrderClaimsReq
  ): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/claims`
    return this.client.request("POST", path, payload)
  }

  cancelClaim(id: string, claimId: string): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/claims/${claimId}/cancel`
    return this.client.request("POST", path)
  }

  updateClaim(
    id: string,
    claimId: string,
    payload: AdminPostOrdersOrderClaimsClaimReq
  ): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/claims/${claimId}`
    return this.client.request("POST", path, payload)
  }

  fulfillClaim(
    id: string,
    claimId: string,
    payload: AdminPostOrdersOrderClaimsClaimFulfillmentsReq
  ): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/claims/${claimId}/fulfillments`
    return this.client.request("POST", path, payload)
  }

  createClaimShipment(
    id: string,
    claimId: string,
    payload: AdminPostOrdersOrderClaimsClaimShipmentsReq
  ): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/claims/${claimId}/shipments`
    return this.client.request("POST", path, payload)
  }

  deleteMetadata(id: string, key: string): ResponsePromise<AdminOrdersRes> {
    const path = `/admin/orders/${id}/metadata/${key}`
    return this.client.request("DELETE", path)
  }
}

export default AdminOrdersResource
