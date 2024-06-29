import {
  MutationOptions,
  QueryKey,
  UseQueryOptions,
  useMutation,
  useQuery,
} from "@tanstack/react-query"

import { FetchError } from "@medusajs/js-sdk"
import { HttpTypes } from "@medusajs/types"
import { sdk } from "../../lib/client"
import { queryClient } from "../../lib/query-client"
import { queryKeysFactory } from "../../lib/query-key-factory"

const STORE_QUERY_KEY = "store" as const
export const storeQueryKeys = queryKeysFactory(STORE_QUERY_KEY)

/**
 * Workaround to keep the V1 version of retrieving the store.
 */
async function retrieveActiveStore(
  query?: HttpTypes.AdminStoreParams
): Promise<HttpTypes.AdminStoreResponse> {
  const response = await sdk.admin.store.list(query)

  const activeStore = response.stores?.[0]

  if (!activeStore) {
    throw new FetchError("No active store found", "Not Found", 404)
  }

  return { store: activeStore }
}

export const useStore = (
  query?: Record<string, any>,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminStoreResponse,
      FetchError,
      HttpTypes.AdminStoreResponse,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => retrieveActiveStore(query),
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
  options?: MutationOptions<
    HttpTypes.AdminStoreResponse,
    FetchError,
    HttpTypes.AdminUpdateStore
  >
) => {
  return useMutation({
    mutationFn: (payload) => sdk.admin.store.update(id, payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: storeQueryKeys.details() })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}
