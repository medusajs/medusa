import { CreateFulfillmentDTO } from "@medusajs/types"

import { FulfillmentRes } from "../../types/api-responses"
import { postRequest } from "./common"

async function createRegion(payload: CreateFulfillmentDTO) {
  return postRequest<FulfillmentRes>(`/admin/fulfillments`, payload)
}

export const fulfillments = {
  create: createRegion,
}
