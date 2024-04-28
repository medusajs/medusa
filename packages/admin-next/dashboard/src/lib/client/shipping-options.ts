import { deleteRequest, getRequest, postRequest } from "./common"
import {
  ShippingOptionDeleteRes,
  ShippingOptionListRes,
  ShippingOptionRes,
} from "../../types/api-responses"
import {
  CreateShippingOptionReq,
  UpdateShippingOptionReq,
} from "../../types/api-payloads"

async function createShippingOptions(payload: CreateShippingOptionReq) {
  return postRequest<ShippingOptionRes>(`/admin/shipping-options`, payload)
}

async function updateShippingOptions(
  id: string,
  payload: UpdateShippingOptionReq
) {
  return postRequest<ShippingOptionRes>(
    `/admin/shipping-options/${id}`,
    payload
  )
}

async function listShippingOptions(query?: Record<string, any>) {
  return getRequest<ShippingOptionListRes>(`/admin/shipping-options`, query)
}

async function deleteShippingOption(optionId: string) {
  return deleteRequest<ShippingOptionDeleteRes>(
    `/admin/shipping-options/${optionId}`
  )
}

export const shippingOptions = {
  create: createShippingOptions,
  update: updateShippingOptions,
  delete: deleteShippingOption,
  list: listShippingOptions,
}
