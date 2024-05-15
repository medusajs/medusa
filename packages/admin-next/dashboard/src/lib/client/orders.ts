import { getRequest } from "./common"
import { OrderListRes, OrderRes } from "../../types/api-responses"

async function retrieveOrder(id: string, query?: Record<string, any>) {
  return getRequest<OrderRes, Record<string, any>>(`/admin/orders/${id}`, query)
}

async function listOrders(query?: Record<string, any>) {
  return getRequest<OrderListRes, Record<string, any>>(`/admin/orders`, query)
}

export const orders = {
  list: listOrders,
  retrieve: retrieveOrder,
}
