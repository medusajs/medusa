import { FetchError } from "@medusajs/js-sdk"
import { HttpTypes } from "@medusajs/types"
import {
  QueryKey,
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query"
import { sdk } from "../../lib/client"
import { queryClient } from "../../lib/query-client"
import { queryKeysFactory } from "../../lib/query-key-factory"
import { ordersQueryKeys } from "./orders"
import { returnsQueryKeys } from "./returns"

const EXCHANGES_QUERY_KEY = "exchanges" as const
export const exchangesQueryKeys = queryKeysFactory(EXCHANGES_QUERY_KEY)

export const useExchange = (
  id: string,
  query?: HttpTypes.AdminExchangeListParams,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminExchangeResponse,
      FetchError,
      HttpTypes.AdminExchangeResponse,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: async () => sdk.admin.exchange.retrieve(id, query),
    queryKey: exchangesQueryKeys.detail(id, query),
    ...options,
  })

  return { ...data, ...rest }
}

export const useExchanges = (
  query?: HttpTypes.AdminExchangeListParams,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminExchangeListParams,
      FetchError,
      HttpTypes.AdminExchangeListResponse,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: async () => sdk.admin.exchange.list(query),
    queryKey: exchangesQueryKeys.list(query),
    ...options,
  })

  return { ...data, ...rest }
}

export const useCreateExchange = (
  orderId: string,
  options?: UseMutationOptions<
    HttpTypes.AdminExchangeResponse,
    FetchError,
    HttpTypes.AdminCreateExchange
  >
) => {
  return useMutation({
    mutationFn: (payload: HttpTypes.AdminCreateExchange) =>
      sdk.admin.exchange.create(payload),
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.details(),
      })

      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.preview(orderId),
      })

      queryClient.invalidateQueries({
        queryKey: exchangesQueryKeys.lists(),
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useCancelExchange = (
  id: string,
  orderId: string,
  options?: UseMutationOptions<HttpTypes.AdminExchangeResponse, FetchError>
) => {
  return useMutation({
    mutationFn: () => sdk.admin.exchange.cancel(id),
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.details(),
      })

      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.preview(orderId),
      })

      queryClient.invalidateQueries({
        queryKey: exchangesQueryKeys.details(),
      })

      queryClient.invalidateQueries({
        queryKey: exchangesQueryKeys.lists(),
      })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useAddExchangeInboundItems = (
  id: string,
  orderId: string,
  options?: UseMutationOptions<
    HttpTypes.AdminExchangeResponse,
    FetchError,
    HttpTypes.AdminAddExchangeInboundItems
  >
) => {
  return useMutation({
    mutationFn: (payload: HttpTypes.AdminAddExchangeInboundItems) =>
      sdk.admin.exchange.addInboundItems(id, payload),
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.preview(orderId),
      })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useUpdateExchangeInboundItem = (
  id: string,
  orderId: string,
  options?: UseMutationOptions<
    HttpTypes.AdminExchangeResponse,
    FetchError,
    HttpTypes.AdminUpdateExchangeInboundItem & { actionId: string }
  >
) => {
  return useMutation({
    mutationFn: ({
      actionId,
      ...payload
    }: HttpTypes.AdminUpdateExchangeInboundItem & { actionId: string }) => {
      return sdk.admin.exchange.updateInboundItem(id, actionId, payload)
    },
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.preview(orderId),
      })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useRemoveExchangeInboundItem = (
  id: string,
  orderId: string,
  options?: UseMutationOptions<
    HttpTypes.AdminExchangeResponse,
    FetchError,
    string
  >
) => {
  return useMutation({
    mutationFn: (actionId: string) =>
      sdk.admin.exchange.removeInboundItem(id, actionId),
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.details(),
      })

      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.preview(orderId),
      })

      queryClient.invalidateQueries({
        queryKey: returnsQueryKeys.details(),
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useAddExchangeInboundShipping = (
  id: string,
  orderId: string,
  options?: UseMutationOptions<
    HttpTypes.AdminExchangeResponse,
    FetchError,
    HttpTypes.AdminExchangeAddInboundShipping
  >
) => {
  return useMutation({
    mutationFn: (payload: HttpTypes.AdminExchangeAddInboundShipping) =>
      sdk.admin.exchange.addInboundShipping(id, payload),
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.preview(orderId),
      })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useUpdateExchangeInboundShipping = (
  id: string,
  orderId: string,
  options?: UseMutationOptions<
    HttpTypes.AdminExchangeResponse,
    FetchError,
    HttpTypes.AdminExchangeUpdateInboundShipping
  >
) => {
  return useMutation({
    mutationFn: ({
      actionId,
      ...payload
    }: HttpTypes.AdminExchangeUpdateInboundShipping & { actionId: string }) =>
      sdk.admin.exchange.updateInboundShipping(id, actionId, payload),
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.preview(orderId),
      })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useDeleteExchangeInboundShipping = (
  id: string,
  orderId: string,
  options?: UseMutationOptions<
    HttpTypes.AdminExchangeResponse,
    FetchError,
    string
  >
) => {
  return useMutation({
    mutationFn: (actionId: string) =>
      sdk.admin.exchange.deleteInboundShipping(id, actionId),
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.preview(orderId),
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useAddExchangeOutboundItems = (
  id: string,
  orderId: string,
  options?: UseMutationOptions<
    HttpTypes.AdminExchangeResponse,
    FetchError,
    HttpTypes.AdminAddExchangeOutboundItems
  >
) => {
  return useMutation({
    mutationFn: (payload: HttpTypes.AdminAddExchangeOutboundItems) =>
      sdk.admin.exchange.addOutboundItems(id, payload),
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.preview(orderId),
      })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useUpdateExchangeOutboundItems = (
  id: string,
  orderId: string,
  options?: UseMutationOptions<
    HttpTypes.AdminExchangeResponse,
    FetchError,
    HttpTypes.AdminUpdateExchangeOutboundItem & { actionId: string }
  >
) => {
  return useMutation({
    mutationFn: ({
      actionId,
      ...payload
    }: HttpTypes.AdminUpdateExchangeOutboundItem & { actionId: string }) => {
      return sdk.admin.exchange.updateOutboundItem(id, actionId, payload)
    },
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.preview(orderId),
      })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useRemoveExchangeOutboundItem = (
  id: string,
  orderId: string,
  options?: UseMutationOptions<
    HttpTypes.AdminExchangeResponse,
    FetchError,
    string
  >
) => {
  return useMutation({
    mutationFn: (actionId: string) =>
      sdk.admin.exchange.removeOutboundItem(id, actionId),
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.details(),
      })

      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.preview(orderId),
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useAddExchangeOutboundShipping = (
  id: string,
  orderId: string,
  options?: UseMutationOptions<
    HttpTypes.AdminExchangeResponse,
    FetchError,
    HttpTypes.AdminExchangeAddOutboundShipping
  >
) => {
  return useMutation({
    mutationFn: (payload: HttpTypes.AdminExchangeAddOutboundShipping) =>
      sdk.admin.exchange.addOutboundShipping(id, payload),
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.preview(orderId),
      })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useUpdateExchangeOutboundShipping = (
  id: string,
  orderId: string,
  options?: UseMutationOptions<
    HttpTypes.AdminExchangeResponse,
    FetchError,
    HttpTypes.AdminExchangeUpdateOutboundShipping
  >
) => {
  return useMutation({
    mutationFn: ({
      actionId,
      ...payload
    }: HttpTypes.AdminExchangeUpdateOutboundShipping & { actionId: string }) =>
      sdk.admin.exchange.updateOutboundShipping(id, actionId, payload),
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.preview(orderId),
      })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useDeleteExchangeOutboundShipping = (
  id: string,
  orderId: string,
  options?: UseMutationOptions<
    HttpTypes.AdminExchangeResponse,
    FetchError,
    string
  >
) => {
  return useMutation({
    mutationFn: (actionId: string) =>
      sdk.admin.exchange.deleteOutboundShipping(id, actionId),
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.preview(orderId),
      })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useExchangeConfirmRequest = (
  id: string,
  orderId: string,
  options?: UseMutationOptions<
    HttpTypes.AdminExchangeResponse,
    FetchError,
    HttpTypes.AdminRequestExchange
  >
) => {
  return useMutation({
    mutationFn: (payload: HttpTypes.AdminRequestExchange) =>
      sdk.admin.exchange.request(id, payload),
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({
        queryKey: returnsQueryKeys.all,
      })

      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.details(),
      })

      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.preview(orderId),
      })

      queryClient.invalidateQueries({
        queryKey: exchangesQueryKeys.lists(),
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useCancelExchangeRequest = (
  id: string,
  orderId: string,
  options?: UseMutationOptions<HttpTypes.AdminExchangeResponse, FetchError>
) => {
  return useMutation({
    mutationFn: () => sdk.admin.exchange.cancelRequest(id),
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.details(),
      })

      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.preview(orderId),
      })

      queryClient.invalidateQueries({
        queryKey: exchangesQueryKeys.details(),
      })
      queryClient.invalidateQueries({
        queryKey: exchangesQueryKeys.lists(),
      })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}
