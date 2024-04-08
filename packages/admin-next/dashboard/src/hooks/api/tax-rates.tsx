import {
  AdminPostTaxRatesReq,
  AdminPostTaxRatesTaxRateReq,
} from "@medusajs/medusa"
import { AdminTaxRateListResponse, AdminTaxRateResponse } from "@medusajs/types"
import {
  QueryKey,
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query"
import { client } from "../../lib/client"
import { queryClient } from "../../lib/medusa"
import { queryKeysFactory } from "../../lib/query-key-factory"
import { TaxRateDeleteRes } from "../../types/api-responses"

const TAX_RATES_QUERY_KEY = "tax_rates" as const
export const taxRatesQueryKeys = queryKeysFactory(TAX_RATES_QUERY_KEY)

export const useTaxRate = (
  id: string,
  query?: Record<string, any>,
  options?: Omit<
    UseQueryOptions<
      AdminTaxRateResponse,
      Error,
      AdminTaxRateResponse,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryKey: taxRatesQueryKeys.detail(id),
    queryFn: async () => client.taxes.retrieveTaxRate(id, query),
    ...options,
  })

  return { ...data, ...rest }
}

export const useTaxRates = (
  query?: Record<string, any>,
  options?: Omit<
    UseQueryOptions<
      AdminTaxRateListResponse,
      Error,
      AdminTaxRateListResponse,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => client.taxes.listTaxRates(query),
    queryKey: taxRatesQueryKeys.list(query),
    ...options,
  })

  return { ...data, ...rest }
}

export const useUpdateTaxRate = (
  id: string,
  options?: UseMutationOptions<
    AdminTaxRateResponse,
    Error,
    AdminPostTaxRatesTaxRateReq
  >
) => {
  return useMutation({
    mutationFn: (payload) => client.taxes.updateTaxRate(id, payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: taxRatesQueryKeys.lists() })
      queryClient.invalidateQueries({
        queryKey: taxRatesQueryKeys.detail(id),
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useCreateTaxRate = (
  options?: UseMutationOptions<
    AdminTaxRateResponse,
    Error,
    AdminPostTaxRatesReq
  >
) => {
  return useMutation({
    mutationFn: (payload) => client.taxes.createTaxRate(payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: taxRatesQueryKeys.lists() })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useDeleteTaxRate = (
  id: string,
  options?: UseMutationOptions<TaxRateDeleteRes, Error, void>
) => {
  return useMutation({
    mutationFn: () => client.taxes.deleteTaxRate(id),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: taxRatesQueryKeys.lists() })
      queryClient.invalidateQueries({
        queryKey: taxRatesQueryKeys.detail(id),
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}
