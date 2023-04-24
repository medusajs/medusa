import { Response } from "@medusajs/medusa-js"
import { AxiosResponse } from "axios"
import { UseQueryOptionsWrapper } from "medusa-react/dist/types"
import { useQuery } from "react-query"
import queryClient from "../../../services/queryClient"
import medusaRequest from "../../../services/request"
import { queryKeysFactory } from "../../utils"

export interface UniscoConfig {
  id: string
  username: string
  password: string
  unisco_base_url: string
  unisco_company_id: string
  unisco_customer_id: string
  unisco_facility_id: string
  automatically_fulfill_orders: boolean
}

const UNISCO_QUERY_KEY = `unisco,count` as const

export const uniscoKeys = queryKeysFactory(UNISCO_QUERY_KEY)

type UniscoQueryKeys = typeof uniscoKeys

export const clearShipStationCache = () => queryClient.clear()

export const useGetUniscoConfig = (
  options?: UseQueryOptionsWrapper<
    AxiosResponse<{ config: UniscoConfig }>,
    Error,
    ReturnType<UniscoQueryKeys["detail"]>
  >
) => {
  const path = `/admin/unisco/config`

  const { data, refetch, ...rest } = useQuery(
    uniscoKeys.detail(""),
    () => medusaRequest<Response<{ config: UniscoConfig }>>("GET", path),
    options
  )
  return { ...data?.data, ...rest, refetch }
}
