import { getRequest, postRequest } from "./common"
import {
  FulfillmentRes,
  OrderListRes,
  OrderRes,
} from "../../types/api-responses"
import { CreateFulfillmentDTO } from "@medusajs/types"

async function retrieveOrder(id: string, query?: Record<string, any>) {
  return getRequest<OrderRes, Record<string, any>>(`/admin/orders/${id}`, query)
}

async function listOrders(query?: Record<string, any>) {
  return getRequest<OrderListRes, Record<string, any>>(`/admin/orders`, query)
}

async function createFulfillment(
  orderId: string,
  payload: CreateFulfillmentDTO
) {
  return postRequest<FulfillmentRes>(
    `/admin/orders/${orderId}/fulfillments`,
    payload
  )
}

async function cancelFulfillment(
  orderId: string,
  fulfillmentId: string,
  payload: { no_notification?: boolean }
) {
  return postRequest<FulfillmentRes>(
    `/admin/orders/${orderId}/fulfillments/${fulfillmentId}/cancel`,
    payload
  )
}

export const orders = {
  list: listOrders,
  retrieve: retrieveOrder,
  createFulfillment,
  cancelFulfillment,
}
