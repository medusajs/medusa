import { Response } from "@medusajs/medusa-js"
import {
  QueryClient,
  QueryKey,
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query"
import {
  adminCollectionKeys,
  adminCustomerKeys,
  adminOrderKeys,
  adminProductKeys,
  useMedusa,
} from "medusa-react"

const domainKeys = {
  product: adminProductKeys.all,
  order: adminOrderKeys.all,
  customer: adminCustomerKeys.all,
  product_collection: adminCollectionKeys.all,
}

type DomainKey = keyof typeof domainKeys

interface Options<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown
> extends Omit<
    UseMutationOptions<TData, TError, TVariables, TContext>,
    "mutationFn"
  > {}

interface CustomMutationOptions<TData, TError extends Error, TRes>
  extends Options<Response<TRes>, TError, TData> {
  /**
   * The endpoint to call
   */
  endpoint: string
  /**
   * The domain key to invalidate on success
   * @default undefined
   */
  domain?: DomainKey
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
  TReq extends Record<string, unknown>,
  TRes
>(options: CustomMutationOptions<Response<TRes>, Error, TReq>) {
  const { endpoint, domain, ...rest } = options
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    (payload) => client.admin.custom.post(endpoint, payload),
    buildOptions(
      queryClient,
      domain ? domainKeys[domain] : undefined,
      rest as unknown as Options<Response<TRes>, Error, TReq>
    )
  )
}

export function useCustomUpdateMutation<
  TReq extends Record<string, unknown>,
  TRes
>(
  identifier: string,
  options: CustomMutationOptions<Response<TRes>, Error, TReq>
) {
  const { endpoint, domain, ...rest } = options
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  const formattedEndpoint = endpoint.endsWith("/") ? endpoint : `${endpoint}/`
  const updateEndpoint = `${formattedEndpoint}${identifier}`

  return useMutation(
    (payload) => client.admin.custom.post(updateEndpoint, payload),
    buildOptions(
      queryClient,
      domain ? domainKeys[domain] : undefined,
      rest as unknown as Options<Response<TRes>, Error, TReq>
    )
  )
}

export function useCustomDeleteMutation<TRes>(
  identifier: string,
  options: CustomMutationOptions<Response<TRes>, Error, void>
) {
  const { endpoint, domain, ...rest } = options
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    () => client.admin.custom.delete(endpoint, identifier),
    buildOptions(
      queryClient,
      domain ? domainKeys[domain] : undefined,
      rest as unknown as Options<Response<TRes>, Error, void>
    )
  )
}

const Test = () => {
  const { mutate } = useCustomDeleteMutation("id", {
    endpoint: "endpoint",
  })

  mutate(undefined, {
    onSuccess: (res) => {},
  })
}
