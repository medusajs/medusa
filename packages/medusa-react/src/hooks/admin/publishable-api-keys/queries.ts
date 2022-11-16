import {
  AdminPublishableApiKeysListRes,
  AdminPublishableApiKeysRes,
  GetPublishableApiKeysParams,
} from "@medusajs/medusa"
import { useQuery } from "react-query"
import { Response } from "@medusajs/medusa-js"

import { queryKeysFactory } from "../../utils"
import { useMedusa } from "../../../contexts"
import { UseQueryOptionsWrapper } from "../../../types"

const ADMIN_PUBLISHABLE_API_KEYS_QUERY_KEY =
  `admin_publishable_api_keys` as const

export const adminPublishableApiKeysKeys = queryKeysFactory(
  ADMIN_PUBLISHABLE_API_KEYS_QUERY_KEY
)
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
