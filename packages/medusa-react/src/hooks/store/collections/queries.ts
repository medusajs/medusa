import {
  StoreCollectionsListRes,
  StoreCollectionsRes,
  StoreGetCollectionsParams,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { useQuery } from "@tanstack/react-query"
import { useMedusa } from "../../../contexts/medusa"
import { UseQueryOptionsWrapper } from "../../../types"
import { queryKeysFactory } from "../../utils/index"

const COLLECTIONS_QUERY_KEY = `collections` as const

export const collectionKeys = queryKeysFactory(COLLECTIONS_QUERY_KEY)

type CollectionQueryKey = typeof collectionKeys

export const useCollection = (
  id: string,
  options?: UseQueryOptionsWrapper<
    Response<StoreCollectionsRes>,
    Error,
    ReturnType<CollectionQueryKey["detail"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    collectionKeys.detail(id),
    () => client.collections.retrieve(id),
    options
  )
  return { ...data, ...rest } as const
}

export const useCollections = (
  query?: StoreGetCollectionsParams,
  options?: UseQueryOptionsWrapper<
    Response<StoreCollectionsListRes>,
    Error,
    ReturnType<CollectionQueryKey["list"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    collectionKeys.list(query),
    () => client.collections.list(query),
    options
  )
  return { ...data, ...rest } as const
}
