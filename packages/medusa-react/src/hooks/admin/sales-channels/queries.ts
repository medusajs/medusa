import {
  AdminSalesChannelRes
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { useQuery } from "react-query"
import { useMedusa } from "../../../contexts"
import { UseQueryOptionsWrapper } from "../../../types"
import { queryKeysFactory } from "../../utils"

const ADMIN_SALES_CHANNELS_QUERY_KEY = `admin_sales_channels` as const

export const adminSalesChannelsKeys = queryKeysFactory(ADMIN_SALES_CHANNELS_QUERY_KEY)

type SalesChannelsQueryKeys = typeof adminSalesChannelsKeys

export const useAdminSalesChannel = (
  id: string,
  options?: UseQueryOptionsWrapper<
    Response<AdminSalesChannelRes>,
    Error,
    ReturnType<SalesChannelsQueryKeys["detail"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    adminSalesChannelsKeys.detail(id),
    () => client.admin.salesChannels.retrieve(id),
    options
  )
  return { ...data, ...rest } as const
}

/*
export const useAdminSalesChannels = (
  query?: AdminGetSalesChannelsParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminProductsListRes>,
    Error,
    ReturnType<SalesChannelsQueryKeys["list"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    adminProductKeys.list(query),
    () => client.admin.salesChannels.list(query),
    options
  )
  return { ...data, ...rest } as const
}
*/

