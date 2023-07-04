import {
  AdminPublishableApiKeysListRes,
  AdminPublishableApiKeysRes,
  AdminSalesChannelsListRes,
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

export const useAdminPublishableApiKey = (
  id: string,
  query?: GetPublishableApiKeysParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminPublishableApiKeysRes>,
    Error,
    ReturnType<PublishableApiKeyQueryKeys["detail"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    adminPublishableApiKeysKeys.detail(id),
    () => client.admin.publishableApiKeys.retrieve(id, query),
    options
  )
  return { ...data, ...rest } as const
}

export const useAdminPublishableApiKeys = (
  query?: GetPublishableApiKeysParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminPublishableApiKeysListRes>,
    Error,
    ReturnType<PublishableApiKeyQueryKeys["list"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    adminPublishableApiKeysKeys.list(query),
    () => client.admin.publishableApiKeys.list(query),
    options
  )
  return { ...data, ...rest } as const
}

export const useAdminPublishableApiKeySalesChannels = (
  id: string,
  query?: GetPublishableApiKeySalesChannelsParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminSalesChannelsListRes>,
    Error,
    ReturnType<PublishableApiKeyQueryKeys["detailSalesChannels"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    adminPublishableApiKeysKeys.detailSalesChannels(id, query),
    () => client.admin.publishableApiKeys.listSalesChannels(id, query),
    options
  )
  return { ...data, ...rest } as const
}
