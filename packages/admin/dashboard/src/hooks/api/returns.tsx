import { HttpTypes } from "@medusajs/types"
import {
  QueryKey,
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query"

import { FetchError } from "@medusajs/js-sdk"
import { sdk } from "../../lib/client"
import { queryClient } from "../../lib/query-client"
import { queryKeysFactory } from "../../lib/query-key-factory"
import { ordersQueryKeys } from "./orders"

const RETURNS_QUERY_KEY = "returns" as const
export const returnsQueryKeys = queryKeysFactory(RETURNS_QUERY_KEY)

export const useReturn = (
  id: string,
  query?: Record<string, any>,
  options?: Omit<
    UseQueryOptions<any, FetchError, any, QueryKey>,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: async () => sdk.admin.return.retrieve(id, query),
    queryKey: returnsQueryKeys.detail(id, query),
    ...options,
  })

  return { ...data, ...rest }
}

export const useReturns = (
  query?: HttpTypes.AdminReturnFilters,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminReturnFilters,
      FetchError,
      HttpTypes.AdminReturnsResponse,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: async () => sdk.admin.return.list(query),
    queryKey: returnsQueryKeys.list(query),
    ...options,
  })

  return { ...data, ...rest }
}

export const useInitiateReturn = (
  orderId: string,
  options?: UseMutationOptions<
    HttpTypes.AdminReturnResponse,
    FetchError,
    HttpTypes.AdminInitiateReturnRequest
  >
) => {
  return useMutation({
    mutationFn: (payload: HttpTypes.AdminInitiateReturnRequest) =>
      sdk.admin.return.initiateRequest(payload),
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.details(),
      })

      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.preview(orderId),
      })

      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.preview(orderId),
      })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useCancelReturn = (
  id: string,
  orderId: string,
  options?: UseMutationOptions<HttpTypes.AdminReturnResponse, FetchError>
) => {
  return useMutation({
    mutationFn: () => sdk.admin.return.cancel(id),
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.details(),
      })

      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.preview(orderId),
        refetchType: "all", // We want preview to be updated in the cache immediately
      })

      queryClient.invalidateQueries({
        queryKey: returnsQueryKeys.details(),
      })
      queryClient.invalidateQueries({
        queryKey: returnsQueryKeys.lists(),
      })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

/**
 * REQUEST RETURN
 */

export const useConfirmReturnRequest = (
  id: string,
  orderId: string,
  options?: UseMutationOptions<
    HttpTypes.AdminReturnResponse,
    FetchError,
    HttpTypes.AdminConfirmReturnRequest
  >
) => {
  return useMutation({
    mutationFn: (payload: HttpTypes.AdminConfirmReturnRequest) =>
      sdk.admin.return.confirmRequest(id, payload),
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
      queryClient.invalidateQueries({
        queryKey: returnsQueryKeys.lists(),
      })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useCancelReturnRequest = (
  id: string,
  orderId: string,
  options?: UseMutationOptions<HttpTypes.AdminReturnResponse, FetchError>
) => {
  return useMutation({
    mutationFn: () => sdk.admin.return.cancelRequest(id),
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.details(),
      })

      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.preview(orderId),
        refetchType: "all", // We want preview to be updated in the cache immediately
      })

      queryClient.invalidateQueries({
        queryKey: returnsQueryKeys.details(),
      })

      queryClient.invalidateQueries({
        queryKey: returnsQueryKeys.lists(),
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useAddReturnItem = (
  id: string,
  orderId: string,
  options?: UseMutationOptions<
    HttpTypes.AdminReturnResponse,
    FetchError,
    HttpTypes.AdminAddReturnItems
  >
) => {
  return useMutation({
    mutationFn: (payload: HttpTypes.AdminAddReturnItems) =>
      sdk.admin.return.addReturnItem(id, payload),
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

export const useUpdateReturnItem = (
  id: string,
  orderId: string,
  options?: UseMutationOptions<
    HttpTypes.AdminReturnResponse,
    FetchError,
    HttpTypes.AdminUpdateReturnItems & { actionId: string }
  >
) => {
  return useMutation({
    mutationFn: ({
      actionId,
      ...payload
    }: HttpTypes.AdminUpdateReturnItems & { actionId: string }) => {
      return sdk.admin.return.updateReturnItem(id, actionId, payload)
    },
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

export const useRemoveReturnItem = (
  id: string,
  orderId: string,
  options?: UseMutationOptions<
    HttpTypes.AdminReturnResponse,
    FetchError,
    string
  >
) => {
  return useMutation({
    mutationFn: (actionId: string) =>
      sdk.admin.return.removeReturnItem(id, actionId),
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

export const useUpdateReturn = (
  id: string,
  orderId: string,
  options?: UseMutationOptions<
    HttpTypes.AdminReturnResponse,
    FetchError,
    HttpTypes.AdminUpdateReturnRequest
  >
) => {
  return useMutation({
    mutationFn: (payload: HttpTypes.AdminUpdateReturnRequest) => {
      return sdk.admin.return.updateRequest(id, payload)
    },
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

export const useAddReturnShipping = (
  id: string,
  orderId: string,
  options?: UseMutationOptions<
    HttpTypes.AdminReturnResponse,
    FetchError,
    HttpTypes.AdminAddReturnShipping
  >
) => {
  return useMutation({
    mutationFn: (payload: HttpTypes.AdminAddReturnShipping) =>
      sdk.admin.return.addReturnShipping(id, payload),
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

export const useUpdateReturnShipping = (
  id: string,
  orderId: string,
  options?: UseMutationOptions<
    HttpTypes.AdminReturnResponse,
    FetchError,
    HttpTypes.AdminAddReturnShipping
  >
) => {
  return useMutation({
    mutationFn: ({
      actionId,
      ...payload
    }: HttpTypes.AdminAddReturnShipping & { actionId: string }) =>
      sdk.admin.return.updateReturnShipping(id, actionId, payload),
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

export const useDeleteReturnShipping = (
  id: string,
  orderId: string,
  options?: UseMutationOptions<
    HttpTypes.AdminReturnResponse,
    FetchError,
    string
  >
) => {
  return useMutation({
    mutationFn: (actionId: string) =>
      sdk.admin.return.deleteReturnShipping(id, actionId),
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

/**
 * RECEIVE RETURN
 */

export const useInitiateReceiveReturn = (
  id: string,
  orderId: string,
  options?: UseMutationOptions<
    HttpTypes.AdminReturnResponse,
    FetchError,
    HttpTypes.AdminInitiateReceiveReturn
  >
) => {
  return useMutation({
    mutationFn: (payload: HttpTypes.AdminInitiateReceiveReturn) =>
      sdk.admin.return.initiateReceive(id, payload),
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

export const useAddReceiveItems = (
  id: string,
  orderId: string,
  options?: UseMutationOptions<
    HttpTypes.AdminReturnResponse,
    FetchError,
    HttpTypes.AdminReceiveItems
  >
) => {
  return useMutation({
    mutationFn: (payload: HttpTypes.AdminReceiveItems) =>
      sdk.admin.return.receiveItems(id, payload),
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

export const useUpdateReceiveItem = (
  id: string,
  orderId: string,
  options?: UseMutationOptions<
    HttpTypes.AdminReturnResponse,
    FetchError,
    HttpTypes.AdminUpdateReceiveItems & { actionId: string }
  >
) => {
  return useMutation({
    mutationFn: ({
      actionId,
      ...payload
    }: HttpTypes.AdminUpdateReceiveItems & { actionId: string }) => {
      return sdk.admin.return.updateReceiveItem(id, actionId, payload)
    },
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

export const useRemoveReceiveItems = (
  id: string,
  orderId: string,
  options?: UseMutationOptions<
    HttpTypes.AdminReturnResponse,
    FetchError,
    string
  >
) => {
  return useMutation({
    mutationFn: (actionId: string) => {
      return sdk.admin.return.removeReceiveItem(id, actionId)
    },
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

export const useAddDismissItems = (
  id: string,
  orderId: string,
  options?: UseMutationOptions<
    HttpTypes.AdminReturnResponse,
    FetchError,
    HttpTypes.AdminDismissItems
  >
) => {
  return useMutation({
    mutationFn: (payload: HttpTypes.AdminDismissItems) =>
      sdk.admin.return.dismissItems(id, payload),
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

export const useUpdateDismissItem = (
  id: string,
  orderId: string,
  options?: UseMutationOptions<
    HttpTypes.AdminReturnResponse,
    FetchError,
    HttpTypes.AdminUpdateDismissItems & { actionId: string }
  >
) => {
  return useMutation({
    mutationFn: ({
      actionId,
      ...payload
    }: HttpTypes.AdminUpdateReceiveItems & { actionId: string }) => {
      return sdk.admin.return.updateDismissItem(id, actionId, payload)
    },
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

export const useRemoveDismissItem = (
  id: string,
  orderId: string,
  options?: UseMutationOptions<
    HttpTypes.AdminReturnResponse,
    FetchError,
    string
  >
) => {
  return useMutation({
    mutationFn: (actionId: string) => {
      return sdk.admin.return.removeDismissItem(id, actionId)
    },
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

export const useConfirmReturnReceive = (
  id: string,
  orderId: string,
  options?: UseMutationOptions<
    HttpTypes.AdminReturnResponse,
    FetchError,
    HttpTypes.AdminConfirmReceiveReturn
  >
) => {
  return useMutation({
    mutationFn: (payload: HttpTypes.AdminConfirmReceiveReturn) =>
      sdk.admin.return.confirmReceive(id, payload),
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
      queryClient.invalidateQueries({
        queryKey: returnsQueryKeys.lists(),
      })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useCancelReceiveReturn = (
  id: string,
  orderId: string,
  options?: UseMutationOptions<HttpTypes.AdminReturnResponse, FetchError>
) => {
  return useMutation({
    mutationFn: () => sdk.admin.return.cancelReceive(id),
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.details(),
      })

      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.preview(orderId),
        refetchType: "all", // We want preview to be updated in the cache immediately
      })

      queryClient.invalidateQueries({
        queryKey: returnsQueryKeys.details(),
      })
      queryClient.invalidateQueries({
        queryKey: returnsQueryKeys.lists(),
      })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}
