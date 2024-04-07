import { postRequest } from "./common"
import { ShippingOptionRes } from "../../types/api-responses"
import { CreateShippingOptionReq } from "../../types/api-payloads"

async function createShippingOptions(payload: CreateShippingOptionReq) {
  return postRequest<ShippingOptionRes>(`/admin/shipping-options`, payload)
}

export const shippingOptions = { create: createShippingOptions }
