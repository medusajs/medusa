import { Response } from "@medusajs/medusa-js"
import { AxiosResponse } from "axios"
import { UseQueryOptionsWrapper } from "medusa-react/dist/types"
import { useQuery } from "react-query"
import queryClient from "../../../services/queryClient"
import medusaRequest from "../../../services/request"
import { queryKeysFactory } from "../../utils"

export interface ShipStationConfig {
  id: string
  vendor_id: string
  api_key: string
  api_secret: string
  shipstation_store_id: string
  shipstation_branding_id: string
  automatically_fulfill_orders: boolean
  created_at: string
  updated_at: string
}

export interface ShipStationStore {
  name: string
  id: string
}

const SHIPSTATION_QUERY_KEY = `shipstation,count` as const

export const shipStationKeys = queryKeysFactory(SHIPSTATION_QUERY_KEY)

type ShipStationQueryKeys = typeof shipStationKeys

export const clearShipStationCache = () => queryClient.clear()

export const useGetShipStationConfig = (
  vendorId: string,
  options?: UseQueryOptionsWrapper<
    AxiosResponse<{ config: ShipStationConfig }>,
    Error,
    ReturnType<ShipStationQueryKeys["detail"]>
  >
) => {
  const path = `/admin/vendors/${vendorId}/shipstation/config`

  const { data, refetch, ...rest } = useQuery(
    shipStationKeys.detail(vendorId),
    () => medusaRequest<Response<{ config: ShipStationConfig }>>("GET", path),
    options
  )
  return { ...data, ...rest, refetch }
}

export const useGetShipStationStores = (
  vendorId: string,
  options?: UseQueryOptionsWrapper<
    AxiosResponse<{ stores: ShipStationStore[] }>,
    Error,
    ReturnType<any>
  >
) => {
  const path = `/admin/vendors/${vendorId}/shipstation/stores`

  const { data, ...rest } = useQuery(
    shipStationKeys.list(["/admin/vendor/shipstation/stores", vendorId]),
    () => medusaRequest<Response<{ stores: ShipStationStore[] }>>("GET", path),
    options
  )
  return { ...data, ...rest } as const
}
