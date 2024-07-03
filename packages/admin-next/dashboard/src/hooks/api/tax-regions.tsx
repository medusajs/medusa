import { FetchError } from "@medusajs/js-sdk"
import { HttpTypes } from "@medusajs/types"
import {
  QueryKey,
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
} from "@tanstack/react-query"
import { sdk } from "../../lib/client"
import { queryClient } from "../../lib/query-client"
import { queryKeysFactory } from "../../lib/query-key-factory"

const TAX_REGIONS_QUERY_KEY = "tax_regions" as const
export const taxRegionsQueryKeys = queryKeysFactory(TAX_REGIONS_QUERY_KEY)

export const useTaxRegion = (
  id: string,
  query?: HttpTypes.AdminTaxRegionParams,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminTaxRegionResponse,
      FetchError,
      HttpTypes.AdminTaxRegionResponse,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryKey: taxRegionsQueryKeys.detail(id),
    queryFn: async () => sdk.admin.taxRegion.retrieve(id, query),
    ...options,
  })

  return { ...data, ...rest }
}

export const useTaxRegions = (
  query?: HttpTypes.AdminTaxRegionListParams,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminTaxRegionListResponse,
      FetchError,
      HttpTypes.AdminTaxRegionListResponse,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => sdk.admin.taxRegion.list(query),
    queryKey: taxRegionsQueryKeys.list(query),
    ...options,
  })

  return { ...data, ...rest }
}

export const useCreateTaxRegion = (
  options?: UseMutationOptions<
    HttpTypes.AdminTaxRegionResponse,
    FetchError,
    HttpTypes.AdminCreateTaxRegion
  >
) => {
  return useMutation({
    mutationFn: (payload) => sdk.admin.taxRegion.create(payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: taxRegionsQueryKeys.all })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useDeleteTaxRegion = (
  id: string,
  options?: UseMutationOptions<
    HttpTypes.AdminTaxRegionDeleteResponse,
    FetchError,
    void
  >
) => {
  return useMutation({
    mutationFn: () => sdk.admin.taxRegion.delete(id),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: taxRegionsQueryKeys.lists() })
      queryClient.invalidateQueries({
        queryKey: taxRegionsQueryKeys.detail(id),
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}
