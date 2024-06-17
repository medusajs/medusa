import { CreateFulfillmentDTO } from "@medusajs/types"

import { FulfillmentRes } from "../../types/api-responses"
import { postRequest } from "./common"

/**
 * Create a fulfillment.
 * NOTE: to create a fulfillment on an order use orders/:id/fulfillments endpoint
 */
async function createFulfillment(payload: CreateFulfillmentDTO) {
  return postRequest<FulfillmentRes>(`/admin/fulfillments`, payload)
}

/**
 * Cancel a fulfillment.
 * NOTE: to cancel a fulfillment on an order use orders/:id/fulfillments/:id/cancel endpoint
 */
async function cancelFulfillment(id: string) {
  return postRequest<FulfillmentRes>(`/admin/fulfillments/${id}/cancel`)
}

export const fulfillments = {
  create: createFulfillment,
  cancel: cancelFulfillment,
}
