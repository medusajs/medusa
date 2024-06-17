import {
  MutationOptions,
  QueryKey,
  UseQueryOptions,
  useMutation,
  useQuery,
} from "@tanstack/react-query"

import { client } from "../../lib/client"
import { queryClient } from "../../lib/query-client"
import { queryKeysFactory } from "../../lib/query-key-factory"
import { UpdateStoreReq } from "../../types/api-payloads"
import { StoreRes } from "../../types/api-responses"

const STORE_QUERY_KEY = "store" as const
export const storeQueryKeys = queryKeysFactory(STORE_QUERY_KEY)

export const useStore = (
  options?: Omit<
    UseQueryOptions<StoreRes, Error, StoreRes, QueryKey>,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => client.stores.retrieve(),
    queryKey: storeQueryKeys.details(),
    ...options,
  })

  return {
    ...data,
    ...rest,
  }
}

export const useUpdateStore = (
  id: string,
  options?: MutationOptions<StoreRes, Error, UpdateStoreReq>
) => {
  return useMutation({
    mutationFn: (payload) => client.stores.update(id, payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: storeQueryKeys.details() })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}
