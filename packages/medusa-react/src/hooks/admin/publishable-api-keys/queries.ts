import {
  AdminPublishableApiKeysListRes,
  AdminPublishableApiKeysListSalesChannelsRes,
  AdminPublishableApiKeysRes,
  GetPublishableApiKeySalesChannelsParams,
  GetPublishableApiKeysParams,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { useQuery } from "@tanstack/react-query"

import { useMedusa } from "../../../contexts"
import { UseQueryOptionsWrapper } from "../../../types"
import { queryKeysFactory } from "../../utils"

const ADMIN_PUBLISHABLE_API_KEYS_QUERY_KEY =
  `admin_publishable_api_keys` as const

export const adminPublishableApiKeysKeys = {
  ...queryKeysFactory(ADMIN_PUBLISHABLE_API_KEYS_QUERY_KEY),
  detailSalesChannels(id: string, query?: any) {
    return [
      ...this.detail(id),
      "sales_channels" as const,
      { ...(query || {}) },
    ] as const
  },
}

type PublishableApiKeyQueryKeys = typeof adminPublishableApiKeysKeys

/**
 * This hook retrieves a publishable API key's details.
 *
 * @example
 * import React from "react"
 * import {
 *   useAdminPublishableApiKey,
 * } from "medusa-react"
 *
 * type Props = {
 *   publishableApiKeyId: string
 * }
 *
 * const PublishableApiKey = ({
 *   publishableApiKeyId
 * }: Props) => {
 *   const { publishable_api_key, isLoading } =
 *     useAdminPublishableApiKey(
 *       publishableApiKeyId
 *     )
 *
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {publishable_api_key && <span>{publishable_api_key.title}</span>}
 *     </div>
 *   )
 * }
 *
 * export default PublishableApiKey
 *
 * @customNamespace Hooks.Admin.Publishable API Keys
 * @category Queries
 */
export const useAdminPublishableApiKey = (
  /**
   * The publishable API key's ID.
   */
  id: string,
  options?: UseQueryOptionsWrapper<
    Response<AdminPublishableApiKeysRes>,
    Error,
    ReturnType<PublishableApiKeyQueryKeys["detail"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery({
    queryKey: adminPublishableApiKeysKeys.detail(id),
    queryFn: () => client.admin.publishableApiKeys.retrieve(id),
    ...options,
  })
  return { ...data, ...rest } as const
}

/**
 * This hook retrieves a list of publishable API keys. The publishable API keys can be filtered by fields such as `q` passed in `query`.
 * The publishable API keys can also be paginated.
 *
 * @example
 * To list publishable API keys:
 *
 * ```tsx
 * import React from "react"
 * import { PublishableApiKey } from "@medusajs/medusa"
 * import { useAdminPublishableApiKeys } from "medusa-react"
 *
 * const PublishableApiKeys = () => {
 *   const { publishable_api_keys, isLoading } =
 *     useAdminPublishableApiKeys()
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {publishable_api_keys && !publishable_api_keys.length && (
 *         <span>No Publishable API Keys</span>
 *       )}
 *       {publishable_api_keys &&
 *         publishable_api_keys.length > 0 && (
 *         <ul>
 *           {publishable_api_keys.map(
 *             (publishableApiKey: PublishableApiKey) => (
 *               <li key={publishableApiKey.id}>
 *                 {publishableApiKey.title}
 *               </li>
 *             )
 *           )}
 *         </ul>
 *       )}
 *     </div>
 *   )
 * }
 *
 * export default PublishableApiKeys
 * ```
 *
 * By default, only the first `20` records are retrieved. You can control pagination by specifying the `limit` and `offset` properties:
 *
 * ```tsx
 * import React from "react"
 * import { PublishableApiKey } from "@medusajs/medusa"
 * import { useAdminPublishableApiKeys } from "medusa-react"
 *
 * const PublishableApiKeys = () => {
 *   const {
 *     publishable_api_keys,
 *     limit,
 *     offset,
 *     isLoading
 *   } =
 *     useAdminPublishableApiKeys({
 *       limit: 50,
 *       offset: 0
 *     })
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {publishable_api_keys && !publishable_api_keys.length && (
 *         <span>No Publishable API Keys</span>
 *       )}
 *       {publishable_api_keys &&
 *         publishable_api_keys.length > 0 && (
 *         <ul>
 *           {publishable_api_keys.map(
 *             (publishableApiKey: PublishableApiKey) => (
 *               <li key={publishableApiKey.id}>
 *                 {publishableApiKey.title}
 *               </li>
 *             )
 *           )}
 *         </ul>
 *       )}
 *     </div>
 *   )
 * }
 *
 * export default PublishableApiKeys
 * ```
 *
 * @customNamespace Hooks.Admin.Publishable API Keys
 * @category Queries
 */
export const useAdminPublishableApiKeys = (
  /**
   * Filters and pagination configurations to apply on the retrieved publishable API keys.
   */
  query?: GetPublishableApiKeysParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminPublishableApiKeysListRes>,
    Error,
    ReturnType<PublishableApiKeyQueryKeys["list"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery({
    queryKey: adminPublishableApiKeysKeys.list(query),
    queryFn: () => client.admin.publishableApiKeys.list(query),
    ...options,
  })
  return { ...data, ...rest } as const
}

/**
 * This hook lists the sales channels associated with a publishable API key. The sales channels can be
 * filtered by fields such as `q` passed in the `query` parameter.
 *
 * @example
 * import React from "react"
 * import {
 *   useAdminPublishableApiKeySalesChannels,
 * } from "medusa-react"
 *
 * type Props = {
 *   publishableApiKeyId: string
 * }
 *
 * const SalesChannels = ({
 *   publishableApiKeyId
 * }: Props) => {
 *   const { sales_channels, isLoading } =
 *     useAdminPublishableApiKeySalesChannels(
 *       publishableApiKeyId
 *     )
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
 *
 * @customNamespace Hooks.Admin.Publishable API Keys
 * @category Queries
 */
export const useAdminPublishableApiKeySalesChannels = (
  /**
   * The publishable API Key's ID.
   */
  id: string,
  /**
   * Filters to apply on the retrieved sales channels.
   */
  query?: GetPublishableApiKeySalesChannelsParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminPublishableApiKeysListSalesChannelsRes>,
    Error,
    ReturnType<PublishableApiKeyQueryKeys["detailSalesChannels"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery({
    queryKey: adminPublishableApiKeysKeys.detailSalesChannels(id, query),
    queryFn: () => client.admin.publishableApiKeys.listSalesChannels(id, query),
    ...options,
  })
  return { ...data, ...rest } as const
}
