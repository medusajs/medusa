import {
  AdminCollectionsListRes,
  AdminCollectionsRes,
  AdminGetCollectionsParams,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { useQuery } from "@tanstack/react-query"
import { useMedusa } from "../../../contexts"
import { UseQueryOptionsWrapper } from "../../../types"
import { queryKeysFactory } from "../../utils/index"

const ADMIN_COLLECTIONS_QUERY_KEY = `admin_collections` as const

export const adminCollectionKeys = queryKeysFactory(ADMIN_COLLECTIONS_QUERY_KEY)

type CollectionsQueryKey = typeof adminCollectionKeys

export const useAdminCollections = (
  query?: AdminGetCollectionsParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminCollectionsListRes>,
    Error,
    ReturnType<CollectionsQueryKey["list"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    adminCollectionKeys.list(query),
    () => client.admin.collections.list(query),
    options
  )
  return { ...data, ...rest } as const
}

export const useAdminCollection = (
  id: string,
  options?: UseQueryOptionsWrapper<
    Response<AdminCollectionsRes>,
    Error,
    ReturnType<CollectionsQueryKey["detail"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    adminCollectionKeys.detail(id),
    () => client.admin.collections.retrieve(id),
    options
  )
  return { ...data, ...rest } as const
}
