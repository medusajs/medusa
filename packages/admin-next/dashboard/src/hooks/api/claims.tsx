import {
  QueryKey,
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query"
import { HttpTypes } from "@medusajs/types"

import { sdk } from "../../lib/client"
import { queryClient } from "../../lib/query-client"
import { ordersQueryKeys } from "./orders"
import { queryKeysFactory } from "../../lib/query-key-factory"

const CLAIMS_QUERY_KEY = "claims" as const
export const claimsQueryKeys = queryKeysFactory(CLAIMS_QUERY_KEY)

export const useClaim = (
  id: string,
  query?: Record<string, any>,
  options?: Omit<
    UseQueryOptions<any, Error, any, QueryKey>,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: async () => sdk.admin.claim.retrieve(id, query),
    queryKey: claimsQueryKeys.detail(id, query),
    ...options,
  })

  return { ...data, ...rest }
}

export const useClaims = (
  query?: HttpTypes.AdminClaimListParams,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminClaimListParams,
      Error,
      HttpTypes.AdminClaimListResponse,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: async () => sdk.admin.claim.list(query),
    queryKey: claimsQueryKeys.list(query),
    ...options,
  })

  return { ...data, ...rest }
}

export const useCreateClaim = (
  orderId: string,
  options?: UseMutationOptions<
    {
      claim: HttpTypes.AdminClaimResponse
      order: HttpTypes.AdminOrderResponse
    },
    Error,
    HttpTypes.AdminCreateClaim
  >
) => {
  return useMutation({
    mutationFn: (payload: HttpTypes.AdminCreateClaim) =>
      sdk.admin.claim.create(payload),
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.details(),
      })
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.lists(),
      })

      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.preview(orderId),
      })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useCancelClaim = (
  id: string,
  orderId: string,
  options?: UseMutationOptions<HttpTypes.AdminClaimResponse, Error>
) => {
  return useMutation({
    mutationFn: () => sdk.admin.claim.cancel(id),
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.details(),
      })
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.lists(),
      })

      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.preview(orderId),
      })

      queryClient.invalidateQueries({
        queryKey: claimsQueryKeys.details(),
      })
      queryClient.invalidateQueries({
        queryKey: claimsQueryKeys.lists(),
      })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useDeleteClaim = (
  id: string,
  orderId: string,
  options?: UseMutationOptions<HttpTypes.AdminClaimDeleteResponse, Error>
) => {
  return useMutation({
    mutationFn: () => sdk.admin.claim.delete(id),
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.details(),
      })
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.lists(),
      })

      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.preview(orderId),
      })

      queryClient.invalidateQueries({
        queryKey: claimsQueryKeys.details(),
      })
      queryClient.invalidateQueries({
        queryKey: claimsQueryKeys.lists(),
      })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useAddClaimItems = (
  id: string,
  orderId: string,
  options?: UseMutationOptions<
    HttpTypes.AdminClaimResponse,
    Error,
    HttpTypes.AdminAddClaimItems
  >
) => {
  return useMutation({
    mutationFn: (payload: HttpTypes.AdminAddClaimItems) =>
      sdk.admin.claim.addItems(id, payload),
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.preview(orderId),
      })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useUpdateClaimItems = (
  id: string,
  orderId: string,
  options?: UseMutationOptions<
    HttpTypes.AdminClaimResponse,
    Error,
    HttpTypes.AdminUpdateClaimItem & { actionId: string }
  >
) => {
  return useMutation({
    mutationFn: ({
      actionId,
      ...payload
    }: HttpTypes.AdminUpdateClaimItem & { actionId: string }) => {
      return sdk.admin.claim.updateItem(id, actionId, payload)
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

export const useRemoveClaimItem = (
  id: string,
  orderId: string,
  options?: UseMutationOptions<HttpTypes.AdminReturnResponse, Error, string>
) => {
  return useMutation({
    mutationFn: (actionId: string) =>
      sdk.admin.return.removeReturnItem(id, actionId),
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.preview(orderId),
      })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useAddClaimInboundItems = (
  id: string,
  orderId: string,
  options?: UseMutationOptions<
    HttpTypes.AdminClaimResponse,
    Error,
    HttpTypes.AdminAddClaimInboundItems
  >
) => {
  return useMutation({
    mutationFn: (payload: HttpTypes.AdminAddClaimInboundItems) =>
      sdk.admin.claim.addInboundItems(id, payload),
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.preview(orderId),
      })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useUpdateClaimInboundItem = (
  id: string,
  orderId: string,
  options?: UseMutationOptions<
    HttpTypes.AdminClaimResponse,
    Error,
    HttpTypes.AdminUpdateClaimInboundItem & { actionId: string }
  >
) => {
  return useMutation({
    mutationFn: ({
      actionId,
      ...payload
    }: HttpTypes.AdminUpdateClaimInboundItem & { actionId: string }) => {
      return sdk.admin.claim.updateInboundItem(id, actionId, payload)
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

export const useRemoveClaimInboundItem = (
  id: string,
  orderId: string,
  options?: UseMutationOptions<HttpTypes.AdminClaimResponse, Error, string>
) => {
  return useMutation({
    mutationFn: (actionId: string) =>
      sdk.admin.claim.removeInboundItem(id, actionId),
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.preview(orderId),
      })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useAddClaimInboundShipping = (
  id: string,
  orderId: string,
  options?: UseMutationOptions<
    HttpTypes.AdminClaimResponse,
    Error,
    HttpTypes.AdminClaimAddInboundShipping
  >
) => {
  return useMutation({
    mutationFn: (payload: HttpTypes.AdminClaimAddInboundShipping) =>
      sdk.admin.claim.addInboundShipping(id, payload),
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.preview(orderId),
      })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useUpdateClaimInboundShipping = (
  id: string,
  orderId: string,
  options?: UseMutationOptions<
    HttpTypes.AdminClaimResponse,
    Error,
    HttpTypes.AdminClaimUpdateInboundShipping
  >
) => {
  return useMutation({
    mutationFn: ({
      actionId,
      ...payload
    }: HttpTypes.AdminClaimUpdateInboundShipping & { actionId: string }) =>
      sdk.admin.claim.updateInboundShipping(id, actionId, payload),
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.preview(orderId),
      })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useDeleteClaimInboundShipping = (
  id: string,
  orderId: string,
  options?: UseMutationOptions<HttpTypes.AdminClaimResponse, Error, string>
) => {
  return useMutation({
    mutationFn: (actionId: string) =>
      sdk.admin.claim.deleteInboundShipping(id, actionId),
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.preview(orderId),
      })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useAddClaimOutboundItems = (
  id: string,
  orderId: string,
  options?: UseMutationOptions<
    HttpTypes.AdminClaimResponse,
    Error,
    HttpTypes.AdminAddClaimOutboundItems
  >
) => {
  return useMutation({
    mutationFn: (payload: HttpTypes.AdminAddClaimOutboundItems) =>
      sdk.admin.claim.addOutboundItems(id, payload),
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.preview(orderId),
      })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useUpdateClaimOutboundItems = (
  id: string,
  orderId: string,
  options?: UseMutationOptions<
    HttpTypes.AdminClaimResponse,
    Error,
    HttpTypes.AdminUpdateClaimOutboundItem & { actionId: string }
  >
) => {
  return useMutation({
    mutationFn: ({
      actionId,
      ...payload
    }: HttpTypes.AdminUpdateClaimOutboundItem & { actionId: string }) => {
      return sdk.admin.claim.updateOutboundItem(id, actionId, payload)
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

export const useRemoveClaimOutboundItem = (
  id: string,
  orderId: string,
  options?: UseMutationOptions<HttpTypes.AdminClaimResponse, Error, string>
) => {
  return useMutation({
    mutationFn: (actionId: string) =>
      sdk.admin.claim.removeOutboundItem(id, actionId),
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.preview(orderId),
      })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useAddClaimOutboundShipping = (
  id: string,
  orderId: string,
  options?: UseMutationOptions<
    HttpTypes.AdminClaimResponse,
    Error,
    HttpTypes.AdminClaimAddOutboundShipping
  >
) => {
  return useMutation({
    mutationFn: (payload: HttpTypes.AdminClaimAddOutboundShipping) =>
      sdk.admin.claim.addOutboundShipping(id, payload),
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.preview(orderId),
      })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useUpdateClaimOutboundShipping = (
  id: string,
  orderId: string,
  options?: UseMutationOptions<
    HttpTypes.AdminClaimResponse,
    Error,
    HttpTypes.AdminClaimUpdateOutboundShipping
  >
) => {
  return useMutation({
    mutationFn: ({
      actionId,
      ...payload
    }: HttpTypes.AdminClaimUpdateOutboundShipping & { actionId: string }) =>
      sdk.admin.claim.updateOutboundShipping(id, actionId, payload),
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.preview(orderId),
      })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useDeleteClaimOutboundShipping = (
  id: string,
  orderId: string,
  options?: UseMutationOptions<HttpTypes.AdminClaimResponse, Error, string>
) => {
  return useMutation({
    mutationFn: (actionId: string) =>
      sdk.admin.claim.deleteOutboundShipping(id, actionId),
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.preview(orderId),
      })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useRequestClaim = (
  id: string,
  options?: UseMutationOptions<
    HttpTypes.AdminClaimResponse,
    Error,
    HttpTypes.AdminRequestClaim
  >
) => {
  return useMutation({
    mutationFn: (payload: HttpTypes.AdminRequestClaim) =>
      sdk.admin.claim.request(id, payload),
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.details(),
      })
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.lists(),
      })

      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.preview(orderId),
      })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useCancelClaimRequest = (
  id: string,
  orderId: string,
  options?: UseMutationOptions<HttpTypes.AdminClaimResponse, Error>
) => {
  return useMutation({
    mutationFn: () => sdk.admin.claim.cancelRequest(id),
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.details(),
      })
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.lists(),
      })

      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.preview(orderId),
      })

      queryClient.invalidateQueries({
        queryKey: claimsQueryKeys.details(),
      })
      queryClient.invalidateQueries({
        queryKey: claimsQueryKeys.lists(),
      })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}
