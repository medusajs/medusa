import { AxiosError, AxiosResponse } from "axios"
import { useMutation } from "react-query"
import medusaRequest from "../../../services/request"
import { ShippoConfig } from "./shippo-queries"

export interface UpdateShippoConfig {
  api_key?: string
  automatically_fulfill_orders?: boolean
}

export interface CreateShippoConfig {
  api_key: string
}

export const useAdminUpdateShippoConfig = (vendorId: string) => {
  const path = `/admin/vendors/${vendorId}/shippo/config`

  return useMutation<
    AxiosResponse<{ config: ShippoConfig }>,
    AxiosError,
    UpdateShippoConfig
  >((payload) => medusaRequest("PUT", path, payload))
}

export const useAdminCreateShippoConfig = (vendorId: string) => {
  const path = `/admin/vendors/${vendorId}/shippo/config`

  return useMutation<
    AxiosResponse<{ config: ShippoConfig }>,
    AxiosError,
    CreateShippoConfig
  >((payload: CreateShippoConfig) =>
    medusaRequest<{ config: ShippoConfig }>("POST", path, payload)
  )
}
