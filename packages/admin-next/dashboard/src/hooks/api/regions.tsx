import {
  QueryKey,
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
} from "@tanstack/react-query"
import { client } from "../../lib/client"
import { queryClient } from "../../lib/medusa"
import { queryKeysFactory } from "../../lib/query-key-factory"
import { CreateRegionReq, UpdateRegionReq } from "../../types/api-payloads"
import {
  RegionDeleteRes,
  RegionListRes,
  RegionRes,
} from "../../types/api-responses"

const REGIONS_QUERY_KEY = "regions" as const
const regionsQueryKeys = queryKeysFactory(REGIONS_QUERY_KEY)

export const useRegion = (
  id: string,
  query?: Record<string, any>,
  options?: Omit<
    UseQueryOptions<RegionRes, Error, RegionRes, QueryKey>,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryKey: regionsQueryKeys.detail(id),
    queryFn: async () => client.regions.retrieve(id, query),
    ...options,
  })

  return { ...data, ...rest }
}

export const useRegions = (
  query?: Record<string, any>,
  options?: Omit<
    UseQueryOptions<RegionListRes, Error, RegionListRes, QueryKey>,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => client.regions.list(query),
    queryKey: regionsQueryKeys.list(query),
    ...options,
  })

  return { ...data, ...rest }
}

export const useCreateRegion = (
  options?: UseMutationOptions<RegionRes, Error, CreateRegionReq>
) => {
  return useMutation({
    mutationFn: (payload) => client.regions.create(payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: regionsQueryKeys.lists() })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useUpdateRegion = (
  id: string,
  options?: UseMutationOptions<RegionRes, Error, UpdateRegionReq>
) => {
  return useMutation({
    mutationFn: (payload) => client.regions.update(id, payload),
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
  options?: UseMutationOptions<RegionDeleteRes, Error, void>
) => {
  return useMutation({
    mutationFn: () => client.regions.delete(id),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: regionsQueryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: regionsQueryKeys.detail(id) })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}
