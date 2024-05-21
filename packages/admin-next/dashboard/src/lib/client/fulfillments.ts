import { CreateFulfillmentDTO } from "@medusajs/types"

import { FulfillmentRes } from "../../types/api-responses"
import { postRequest } from "./common"

async function createFulfillment(payload: CreateFulfillmentDTO) {
  return postRequest<FulfillmentRes>(`/admin/fulfillments`, payload)
}

async function cancelFulfillment(id: string) {
  return postRequest<FulfillmentRes>(`/admin/fulfillments/${id}/cancel`)
}

export const fulfillments = {
  create: createFulfillment,
  cancel: cancelFulfillment,
}
