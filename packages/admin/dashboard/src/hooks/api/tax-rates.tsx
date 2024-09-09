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
import { taxRegionsQueryKeys } from "./tax-regions"

const TAX_RATES_QUERY_KEY = "tax_rates" as const
export const taxRatesQueryKeys = queryKeysFactory(TAX_RATES_QUERY_KEY)

export const useTaxRate = (
  id: string,
  query?: Record<string, any>,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminTaxRateResponse,
      FetchError,
      HttpTypes.AdminTaxRateResponse,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryKey: taxRatesQueryKeys.detail(id),
    queryFn: async () => sdk.admin.taxRate.retrieve(id, query),
    ...options,
  })

  return { ...data, ...rest }
}

export const useTaxRates = (
  query?: Record<string, any>,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminTaxRateListResponse,
      FetchError,
      HttpTypes.AdminTaxRateListResponse,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => sdk.admin.taxRate.list(query),
    queryKey: taxRatesQueryKeys.list(query),
    ...options,
  })

  return { ...data, ...rest }
}

export const useUpdateTaxRate = (
  id: string,
  options?: UseMutationOptions<
    HttpTypes.AdminTaxRateResponse,
    FetchError,
    HttpTypes.AdminUpdateTaxRate
  >
) => {
  return useMutation({
    mutationFn: (payload) => sdk.admin.taxRate.update(id, payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: taxRatesQueryKeys.lists() })
      queryClient.invalidateQueries({
        queryKey: taxRatesQueryKeys.detail(id),
      })

      queryClient.invalidateQueries({ queryKey: taxRegionsQueryKeys.details() })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useCreateTaxRate = (
  options?: UseMutationOptions<
    HttpTypes.AdminTaxRateResponse,
    FetchError,
    HttpTypes.AdminCreateTaxRate
  >
) => {
  return useMutation({
    mutationFn: (payload) => sdk.admin.taxRate.create(payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: taxRatesQueryKeys.lists() })

      queryClient.invalidateQueries({ queryKey: taxRegionsQueryKeys.details() })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useDeleteTaxRate = (
  id: string,
  options?: UseMutationOptions<
    HttpTypes.AdminTaxRateDeleteResponse,
    FetchError,
    void
  >
) => {
  return useMutation({
    mutationFn: () => sdk.admin.taxRate.delete(id),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: taxRatesQueryKeys.lists() })
      queryClient.invalidateQueries({
        queryKey: taxRatesQueryKeys.detail(id),
      })

      queryClient.invalidateQueries({ queryKey: taxRegionsQueryKeys.details() })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}
