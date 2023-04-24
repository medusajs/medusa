import { AxiosError, AxiosResponse } from "axios"
import { useMutation } from "react-query"
import medusaRequest from "../../../services/request"
import { ShipStationConfig } from "./shipstation-queries"

export interface UpdateShipStationConfig {
  api_key?: string
  api_secret?: string
  shipstation_store_id?: string
  shipstation_branding_id?: string
  automatically_fulfill_orders?: boolean
}

export interface CreateShipStationConfig {
  api_key: string
  api_secret: string
}

export const useAdminUpdateShipStationConfig = (vendorId: string) => {
  const path = `/admin/vendors/${vendorId}/shipstation/config`

  return useMutation<
    AxiosResponse<{ config: ShipStationConfig }>,
    AxiosError,
    UpdateShipStationConfig
  >((payload) => medusaRequest("PUT", path, payload))
}

export const useAdminCreateShipStationConfig = (vendorId: string) => {
  const path = `/admin/vendors/${vendorId}/shipstation/config`

  return useMutation<
    AxiosResponse<{ config: ShipStationConfig }>,
    AxiosError,
    CreateShipStationConfig
  >((payload: CreateShipStationConfig) =>
    medusaRequest<{ config: ShipStationConfig }>("POST", path, payload)
  )
}
