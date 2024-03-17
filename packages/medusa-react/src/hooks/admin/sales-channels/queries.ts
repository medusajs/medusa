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

/**
 * This hook retrieves a sales channel's details.
 *
 * @example
 * import React from "react"
 * import { useAdminSalesChannel } from "medusa-react"
 *
 * type Props = {
 *   salesChannelId: string
 * }
 *
 * const SalesChannel = ({ salesChannelId }: Props) => {
 *   const {
 *     sales_channel,
 *     isLoading,
 *   } = useAdminSalesChannel(salesChannelId)
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {sales_channel && <span>{sales_channel.name}</span>}
 *     </div>
 *   )
 * }
 *
 * export default SalesChannel
 *
 * @customNamespace Hooks.Admin.Sales Channels
 * @category Queries
 */
export const useAdminSalesChannel = (
  /**
   * The sales channel's ID.
   */
  id: string,
  options?: UseQueryOptionsWrapper<
    Response<AdminSalesChannelsRes>,
    Error,
    ReturnType<SalesChannelsQueryKeys["detail"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery({
    queryKey: adminSalesChannelsKeys.detail(id),
    queryFn: () => client.admin.salesChannels.retrieve(id),
    ...options,
  })
  return { ...data, ...rest } as const
}

/**
 * This hook retrieves a list of sales channels. The sales channels can be filtered by fields such as `q` or `name`
 * passed in the `query` parameter. The sales channels can also be sorted or paginated.
 *
 * @example
 * To list sales channels:
 *
 * ```tsx
 * import React from "react"
 * import { useAdminSalesChannels } from "medusa-react"
 *
 * const SalesChannels = () => {
 *   const { sales_channels, isLoading } = useAdminSalesChannels()
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {sales_channels && !sales_channels.length && (
 *         <span>No Sales Channels</span>
 *       )}
 *       {sales_channels && sales_channels.length > 0 && (
 *         <ul>
 *           {sales_channels.map((salesChannel) => (
 *             <li key={salesChannel.id}>{salesChannel.name}</li>
 *           ))}
 *         </ul>
 *       )}
 *     </div>
 *   )
 * }
 *
 * export default SalesChannels
 * ```
 *
 * To specify relations that should be retrieved within the sales channels:
 *
 * ```tsx
 * import React from "react"
 * import { useAdminSalesChannels } from "medusa-react"
 *
 * const SalesChannels = () => {
 *   const {
 *     sales_channels,
 *     isLoading
 *   } = useAdminSalesChannels({
 *     expand: "locations"
 *   })
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {sales_channels && !sales_channels.length && (
 *         <span>No Sales Channels</span>
 *       )}
 *       {sales_channels && sales_channels.length > 0 && (
 *         <ul>
 *           {sales_channels.map((salesChannel) => (
 *             <li key={salesChannel.id}>{salesChannel.name}</li>
 *           ))}
 *         </ul>
 *       )}
 *     </div>
 *   )
 * }
 *
 * export default SalesChannels
 * ```
 *
 * By default, only the first `20` records are retrieved. You can control pagination by specifying the `limit` and `offset` properties:
 *
 * ```tsx
 * import React from "react"
 * import { useAdminSalesChannels } from "medusa-react"
 *
 * const SalesChannels = () => {
 *   const {
 *     sales_channels,
 *     limit,
 *     offset,
 *     isLoading
 *   } = useAdminSalesChannels({
 *     expand: "locations",
 *     limit: 10,
 *     offset: 0
 *   })
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {sales_channels && !sales_channels.length && (
 *         <span>No Sales Channels</span>
 *       )}
 *       {sales_channels && sales_channels.length > 0 && (
 *         <ul>
 *           {sales_channels.map((salesChannel) => (
 *             <li key={salesChannel.id}>{salesChannel.name}</li>
 *           ))}
 *         </ul>
 *       )}
 *     </div>
 *   )
 * }
 *
 * export default SalesChannels
 * ```
 *
 * @customNamespace Hooks.Admin.Sales Channels
 * @category Queries
 */
export const useAdminSalesChannels = (
  /**
   * Filters and pagination configurations applied on the retrieved sales channels.
   */
  query?: AdminGetSalesChannelsParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminSalesChannelsListRes>,
    Error,
    ReturnType<SalesChannelsQueryKeys["list"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery({
    queryKey: adminSalesChannelsKeys.list(query),
    queryFn: () => client.admin.salesChannels.list(query),
    ...options,
  })
  return { ...data, ...rest } as const
}
