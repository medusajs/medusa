import { Response } from "@medusajs/medusa-js"
import { AxiosResponse } from "axios"
import { UseQueryOptionsWrapper } from "medusa-react/dist/types"
import { useQuery } from "react-query"
import medusaRequest from "../../../services/request"
import { queryKeysFactory } from "../../utils"

export interface ShippoConfig {
  id: string
  vendor_id: string
  api_key: string
  automatically_fulfill_orders: boolean
  created_at: string
  updated_at: string
}

const QUERY_KEY = `shippo,count` as const

export const shippoKeys = queryKeysFactory(QUERY_KEY)

type ShippoQueryKeys = typeof shippoKeys

export const useGetShippoConfig = (
  vendorId: string,
  options?: UseQueryOptionsWrapper<
    AxiosResponse<{ config: ShippoConfig }>,
    Error,
    ReturnType<ShippoQueryKeys["detail"]>
  >
) => {
  const path = `/admin/vendors/${vendorId}/shippo/config`

  const { data, refetch, ...rest } = useQuery(
    shippoKeys.detail(vendorId),
    () => medusaRequest<Response<{ config: ShippoConfig }>>("GET", path),
    options
  )
  return { ...data, ...rest, refetch }
}
