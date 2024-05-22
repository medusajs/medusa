import {
  QueryKey,
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
} from "@tanstack/react-query"
import { sdk } from "../../lib/client"
import { queryClient } from "../../lib/medusa"
import { queryKeysFactory } from "../../lib/query-key-factory"
import {
  AdminInviteResponse,
  DeleteResponse,
  HttpTypes,
  PaginatedResponse,
} from "@medusajs/types"

const INVITES_QUERY_KEY = "invites" as const
const invitesQueryKeys = queryKeysFactory(INVITES_QUERY_KEY)

export const useInvite = (
  id: string,
  options?: Omit<
    UseQueryOptions<
      { invite: HttpTypes.AdminInviteResponse },
      Error,
      { invite: HttpTypes.AdminInviteResponse },
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryKey: invitesQueryKeys.detail(id),
    queryFn: async () => sdk.admin.invites.retrieve(id),
    ...options,
  })

  return { ...data, ...rest }
}

export const useInvites = (
  query?: Record<string, any>,
  options?: Omit<
    UseQueryOptions<
      PaginatedResponse<{ invites: HttpTypes.AdminInviteResponse[] }>,
      Error,
      PaginatedResponse<{ invites: HttpTypes.AdminInviteResponse[] }>,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => sdk.admin.invites.list(query),
    queryKey: invitesQueryKeys.list(query),
    ...options,
  })

  return { ...data, ...rest }
}

export const useCreateInvite = (
  options?: UseMutationOptions<
    { invite: AdminInviteResponse },
    Error,
    HttpTypes.AdminCreateInvite
  >
) => {
  return useMutation({
    mutationFn: (payload) => sdk.admin.invites.create(payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: invitesQueryKeys.lists() })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useResendInvite = (
  id: string,
  options?: UseMutationOptions<{ invite: AdminInviteResponse }, Error, void>
) => {
  return useMutation({
    mutationFn: () => sdk.admin.invites.resend(id),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: invitesQueryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: invitesQueryKeys.detail(id) })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useDeleteInvite = (
  id: string,
  options?: UseMutationOptions<DeleteResponse<"invite">, Error, void>
) => {
  return useMutation({
    mutationFn: () => sdk.admin.invites.delete(id),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: invitesQueryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: invitesQueryKeys.detail(id) })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useAcceptInvite = (
  inviteToken: string,
  options?: UseMutationOptions<
    { user: HttpTypes.AdminUserResponse },
    Error,
    HttpTypes.AdminAcceptInvite & { auth_token: string }
  >
) => {
  return useMutation({
    mutationFn: (payload) => {
      const { auth_token, ...rest } = payload

      return sdk.admin.invites.accept(
        { invite_token: inviteToken, ...rest },
        {},
        {
          Authorization: `Bearer ${auth_token}`,
        }
      )
    },
    onSuccess: (data, variables, context) => {
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}
