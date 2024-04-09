import { postRequest } from "./common"
import { ShippingProfileRes } from "../../types/api-responses"
import { CreateShippingProfileReq } from "../../types/api-payloads"

async function createShippingProfile(payload: CreateShippingProfileReq) {
  return postRequest<ShippingProfileRes>(`/admin/shipping-profiles`, payload)
}

export const shippingProfiles = { create: createShippingProfile }
