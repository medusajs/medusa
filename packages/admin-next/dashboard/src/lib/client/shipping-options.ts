import { deleteRequest, postRequest } from "./common"
import {
  ShippingOptionDeleteRes,
  ShippingOptionRes,
} from "../../types/api-responses"
import { CreateShippingOptionReq } from "../../types/api-payloads"

async function createShippingOptions(payload: CreateShippingOptionReq) {
  return postRequest<ShippingOptionRes>(`/admin/shipping-options`, payload)
}

async function deleteShippingOption(optionId: string) {
  return deleteRequest<ShippingOptionDeleteRes>(
    `/admin/shipping-options/${optionId}`
  )
}

export const shippingOptions = {
  create: createShippingOptions,
  delete: deleteShippingOption,
}
