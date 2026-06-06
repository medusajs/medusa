import { FetchError } from "@zjedene-medusa/js-sdk"
import { HttpTypes } from "@zjedene-medusa/types"
import { QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query"
import { sdk } from "../../lib/queries/sdk"

const REGION_QUERY_KEY = "regions"

export const regionsQueryKeys = {
  list: (query?: Record<string, any>) => [
    REGION_QUERY_KEY,
    query ? query : undefined,
  ],
  detail: (id: string, query?: Record<string, any>) => [
    REGION_QUERY_KEY,
    id,
    query ? query : undefined,
  ],
}

export const useRegion = (
  id: string,
  query?: Record<string, any>,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminRegionResponse,
      FetchError,
      HttpTypes.AdminRegionResponse,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryKey: regionsQueryKeys.detail(id, query),
    queryFn: async () => sdk.admin.region.retrieve(id, query),
    ...options,
  })

  return { ...data, ...rest }
}

export const useRegions = (
  query?: HttpTypes.FindParams & HttpTypes.AdminRegionFilters,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.PaginatedResponse<{
        regions: HttpTypes.AdminRegion[]
      }>,
      FetchError,
      HttpTypes.PaginatedResponse<{
        regions: HttpTypes.AdminRegion[]
      }>,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryKey: regionsQueryKeys.list(query),
    queryFn: async () => sdk.admin.region.list(query),
    ...options,
  })

  return { ...data, ...rest }
}
