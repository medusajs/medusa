import { Response } from "@medusajs/medusa-js"
import {
  QueryClient,
  QueryKey,
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query"
import {
  adminCustomerGroupKeys,
  adminCustomerKeys,
  adminDiscountKeys,
  adminGiftCardKeys,
  adminOrderKeys,
  adminPriceListKeys,
  adminProductKeys,
  useMedusa,
} from "medusa-react"

const domainKeys = {
  product: adminProductKeys.all,
  order: adminOrderKeys.all,
  customer: adminCustomerKeys.all,
  customer_group: adminCustomerGroupKeys.all,
  price_list: adminPriceListKeys.all,
  discount: adminDiscountKeys.all,
  gift_card: [adminProductKeys.all, adminGiftCardKeys.all].flat(),
}

type DomainKey = keyof typeof domainKeys

interface Options<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown
> extends Omit<UseMutationOptions, "mutationFn"> {}

interface CustomMutationOptions<TData = any, TRes = any>
  extends Options<Response<TRes>, Error, TData> {
  endpoint: string
  domain?: DomainKey
}

interface CustomDeleteMutationOptions<TRes = any>
  extends UseMutationOptions<Response<TRes>, Error, undefined> {
  identifier: string
}

export const buildOptions = <
  TData,
  TError,
  TVariables,
  TContext,
  TKey extends QueryKey
>(
  queryClient: QueryClient,
  queryKey?: TKey,
  options?: UseMutationOptions<TData, TError, TVariables, TContext>
): UseMutationOptions<TData, TError, TVariables, TContext> => {
  return {
    ...options,
    onSuccess: (...args) => {
      if (options?.onSuccess) {
        return options.onSuccess(...args)
      }

      if (queryKey !== undefined) {
        queryKey.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: key as QueryKey })
        })
      }
    },
  }
}

export function useCustomCreateMutation<
  TData extends Record<string, unknown> = any,
  TRes extends Record<string, unknown> = any
>(options: CustomMutationOptions<TData, TRes>) {
  const { endpoint, domain, ...rest } = options
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    (payload) => client.admin.custom.post(endpoint, payload),
    buildOptions(queryClient, domain ? domainKeys[domain] : undefined, rest)
  )
}

export function useCustomDeleteMutation(options: CustomDeleteMutationOptions) {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
}
