import { UseMutationOptions, useMutation } from "@tanstack/react-query"

import { sdk } from "../../lib/client"
import { EmailPassReq } from "../../types/api-payloads"

export const useEmailPassLogin = (
  options?: UseMutationOptions<void, Error, EmailPassReq>
) => {
  return useMutation({
    mutationFn: (payload) => sdk.auth.login("user", "emailpass", payload),
    onSuccess: async (data, variables, context) => {
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useLogout = (options?: UseMutationOptions<void, Error>) => {
  return useMutation({
    mutationFn: () => sdk.auth.logout(),
    ...options,
  })
}

export const useCreateAuthUser = (
  options?: UseMutationOptions<{ token: string }, Error, EmailPassReq>
) => {
  return useMutation({
    mutationFn: (payload) => sdk.auth.create("user", "emailpass", payload),
    onSuccess: async (data, variables, context) => {
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}
