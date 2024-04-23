import { CreateShippingProfileReq } from "../../types/api-payloads"
import {
  ShippingProfileDeleteRes,
  ShippingProfileListRes,
  ShippingProfileRes,
} from "../../types/api-responses"
import { deleteRequest, getRequest, postRequest } from "./common"

async function createShippingProfile(payload: CreateShippingProfileReq) {
  return postRequest<ShippingProfileRes>(`/admin/shipping-profiles`, payload)
}

async function retrieveShippingProfile(
  id: string,
  query?: Record<string, any>
) {
  return getRequest<ShippingProfileRes>(`/admin/shipping-profiles/${id}`, query)
}

async function listShippingProfiles(query?: Record<string, any>) {
  return getRequest<ShippingProfileListRes>(`/admin/shipping-profiles`, query)
}

async function deleteShippingProfile(id: string) {
  return deleteRequest<ShippingProfileDeleteRes>(
    `/admin/shipping-profiles/${id}`
  )
}

export const shippingProfiles = {
  retrieve: retrieveShippingProfile,
  list: listShippingProfiles,
  create: createShippingProfile,
  delete: deleteShippingProfile,
}
