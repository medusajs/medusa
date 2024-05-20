import {
  QueryKey,
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
} from "@tanstack/react-query"
import { sdk } from "../../lib/client"
import { queryClient } from "../../lib/medusa"
import { queryKeysFactory } from "../../lib/query-key-factory"
import { DeleteResponse, HttpTypes, PaginatedResponse } from "@medusajs/types"

const REGIONS_QUERY_KEY = "regions" as const
const regionsQueryKeys = queryKeysFactory(REGIONS_QUERY_KEY)

export const useRegion = (
  id: string,
  query?: Record<string, any>,
  options?: Omit<
    UseQueryOptions<
      { region: HttpTypes.AdminRegion },
      Error,
      { region: HttpTypes.AdminRegion },
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryKey: regionsQueryKeys.detail(id),
    queryFn: async () => sdk.admin.region.retrieve(id, query),
    ...options,
  })

  return { ...data, ...rest }
}

export const useRegions = (
  query?: Record<string, any>,
  options?: Omit<
    UseQueryOptions<
      PaginatedResponse<{ regions: HttpTypes.AdminRegion[] }>,
      Error,
      PaginatedResponse<{ regions: HttpTypes.AdminRegion[] }>,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => sdk.admin.region.list(query),
    queryKey: regionsQueryKeys.list(query),
    ...options,
  })

  return { ...data, ...rest }
}

export const useCreateRegion = (
  options?: UseMutationOptions<
    { region: HttpTypes.AdminRegion },
    Error,
    HttpTypes.AdminCreateRegion
  >
) => {
  return useMutation({
    mutationFn: (payload) => sdk.admin.region.create(payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: regionsQueryKeys.lists() })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useUpdateRegion = (
  id: string,
  options?: UseMutationOptions<
    { region: HttpTypes.AdminRegion },
    Error,
    HttpTypes.AdminUpdateRegion
  >
) => {
  return useMutation({
    mutationFn: (payload) => sdk.admin.region.update(id, payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: regionsQueryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: regionsQueryKeys.detail(id) })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useDeleteRegion = (
  id: string,
  options?: UseMutationOptions<DeleteResponse<"region">, Error, void>
) => {
  return useMutation({
    mutationFn: () => sdk.admin.region.delete(id),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: regionsQueryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: regionsQueryKeys.detail(id) })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}
