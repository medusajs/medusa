import {
  AdminGetSalesChannelsParams,
  AdminSalesChannelsListRes,
  AdminSalesChannelsRes,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { useQuery } from "@tanstack/react-query"
import { useMedusa } from "../../../contexts"
import { UseQueryOptionsWrapper } from "../../../types"
import { queryKeysFactory } from "../../utils"

const ADMIN_SALES_CHANNELS_QUERY_KEY = `admin_sales_channels` as const

export const adminSalesChannelsKeys = queryKeysFactory(
  ADMIN_SALES_CHANNELS_QUERY_KEY
)

type SalesChannelsQueryKeys = typeof adminSalesChannelsKeys

/** retrieve a sales channel
 * @experimental This feature is under development and may change in the future.
 * To use this feature please enable feature flag `sales_channels` in your medusa backend project.
 * @description gets a sales channel
 * @returns a medusa sales channel
 */
export const useAdminSalesChannel = (
  id: string,
  options?: UseQueryOptionsWrapper<
    Response<AdminSalesChannelsRes>,
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

/**
 * retrieve a list of sales channels
 * @experimental This feature is under development and may change in the future.
 * To use this feature please enable feature flag `sales_channels` in your medusa backend project.
 * @description Retrieve a list of sales channel
 * @returns a list of sales channel as well as the pagination properties
 */
export const useAdminSalesChannels = (
  query?: AdminGetSalesChannelsParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminSalesChannelsListRes>,
    Error,
    ReturnType<SalesChannelsQueryKeys["list"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    adminSalesChannelsKeys.list(query),
    () => client.admin.salesChannels.list(query),
    options
  )
  return { ...data, ...rest } as const
}
