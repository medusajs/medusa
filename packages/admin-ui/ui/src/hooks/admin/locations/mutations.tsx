import {
  AddressCreatePayload,
  AddressPayload,
} from "@medusajs/medusa/dist/types/common"
import { AxiosError, AxiosResponse } from "axios"
import { useMutation } from "react-query"
import medusaRequest from "../../../services/request"

export interface AdminCreateLocationReq {
  name: string
  address: AddressCreatePayload
  default: boolean
}

export interface AdminUpdateLocationReq {
  name?: string
  address?: AddressPayload
  default?: boolean
}

export const useAdminUpdateLocation = (
  vendorId: string,
  locationId: string
) => {
  const path = `/admin/vendors/${vendorId}/locations/${locationId}`

  return useMutation<
    AxiosResponse<{ location: Location }>,
    AxiosError,
    AdminUpdateLocationReq
  >((payload) => medusaRequest("PUT", path, payload), {})
}

export const useAdminCreateLocation = (vendorId: string) => {
  const path = `/admin/vendors/${vendorId}/locations`

  return useMutation<
    AxiosResponse<{ location: Location }>,
    AxiosError,
    AdminCreateLocationReq
  >((payload) => medusaRequest("POST", path, payload))
}
