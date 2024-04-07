import {
  AdminTaxRegionListResponse,
  AdminTaxRegionResponse,
} from "@medusajs/types"
import { QueryKey, UseQueryOptions, useQuery } from "@tanstack/react-query"
import { client } from "../../lib/client"
import { queryKeysFactory } from "../../lib/query-key-factory"

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
