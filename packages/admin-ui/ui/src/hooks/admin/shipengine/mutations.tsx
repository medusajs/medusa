import { useMutation } from "react-query"
import { AxiosError, AxiosResponse } from "axios"
import { ShipEngineRate } from "@medusajs/medusa"
import { AddressCreatePayload } from "@medusajs/medusa/dist/types/common"
import medusaRequest from "../../../services/request"

export interface ShipEngineDimensions {
  length: number
  height?: number
  width: number
}

export interface AdminShipEngineRatesReq {
  to_address: AddressCreatePayload
  from_address: AddressCreatePayload
  package_code?: string
  dimensions?: ShipEngineDimensions
  weight: number
}

export const useAdminGetShipEngineRates = () => {
  const path = `/admin/shipengine/rates`

  return useMutation<
    AxiosResponse<{ rates: ShipEngineRate[] }>,
    AxiosError,
    AdminShipEngineRatesReq
  >((payload) => medusaRequest("POST", path, payload))
}
