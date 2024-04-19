import { AdminCreateTaxRegion } from "@medusajs/medusa"
import {
  AdminTaxRegionListResponse,
  AdminTaxRegionResponse,
} from "@medusajs/types"
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
import { TaxRegionDeleteRes } from "../../types/api-responses"

const TAX_REGIONS_QUERY_KEY = "tax_regions" as const
export const taxRegionsQueryKeys = queryKeysFactory(TAX_REGIONS_QUERY_KEY)

export const useTaxRegion = (
  id: string,
  query?: Record<string, any>,
  options?: Omit<
    UseQueryOptions<
      AdminTaxRegionResponse,
      Error,
      AdminTaxRegionResponse,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryKey: taxRegionsQueryKeys.detail(id),
    queryFn: async () => client.taxes.retrieveTaxRegion(id, query),
    ...options,
  })

  return { ...data, ...rest }
}

export const useTaxRegions = (
  query?: Record<string, any>,
  options?: Omit<
    UseQueryOptions<
      AdminTaxRegionListResponse,
      Error,
      AdminTaxRegionListResponse,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => client.taxes.listTaxRegions(query),
    queryKey: taxRegionsQueryKeys.list(query),
    ...options,
  })

  return { ...data, ...rest }
}

export const useCreateTaxRegion = (
  options?: UseMutationOptions<
    AdminTaxRegionResponse,
    Error,
    AdminCreateTaxRegion
  >
) => {
  return useMutation({
    mutationFn: (payload) => client.taxes.createTaxRegion(payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: taxRegionsQueryKeys.all })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useDeleteTaxRegion = (
  id: string,
  options?: UseMutationOptions<TaxRegionDeleteRes, Error, void>
) => {
  return useMutation({
    mutationFn: () => client.taxes.deleteTaxRegion(id),
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
