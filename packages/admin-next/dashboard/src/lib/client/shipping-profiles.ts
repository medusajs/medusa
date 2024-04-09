import { deleteRequest, getRequest, postRequest } from "./common"
import { CreateShippingProfileReq } from "../../types/api-payloads"
import {
  ShippingProfileDeleteRes,
  ShippingProfileListRes,
  ShippingProfileRes,
} from "../../types/api-responses"

async function createShippingProfile(payload: CreateShippingProfileReq) {
  return postRequest<ShippingProfileRes>(`/admin/shipping-profiles`, payload)
}

async function listShippingProfiles(query?: Record<string, any>) {
  return getRequest<ShippingProfileListRes>(`/admin/shipping-profiles`, query)
}

async function deleteShippingProfile(profileId: string) {
  return deleteRequest<ShippingProfileDeleteRes>(
    `/admin/shipping-profiles/${profileId}`
  )
}

export const shippingProfiles = {
  create: createShippingProfile,
  list: listShippingProfiles,
  delete: deleteShippingProfile,
}
