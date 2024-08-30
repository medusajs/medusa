import { UseMutationOptions, useMutation } from "@tanstack/react-query"
import { FetchError } from "@medusajs/js-sdk"

import { sdk } from "../../lib/client"
import { EmailPassReq } from "../../types/api-payloads"

export const useSignInWithEmailPassword = (
  options?: UseMutationOptions<string, FetchError, EmailPassReq>
) => {
  return useMutation({
    mutationFn: (payload) => sdk.auth.login("user", "emailpass", payload),
    onSuccess: async (data, variables, context) => {
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useSignUpWithEmailPass = (
  options?: UseMutationOptions<string, FetchError, EmailPassReq>
) => {
  return useMutation({
    mutationFn: (payload) => sdk.auth.register("user", "emailpass", payload),
    onSuccess: async (data, variables, context) => {
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useLogout = (options?: UseMutationOptions<void, FetchError>) => {
  return useMutation({
    mutationFn: () => sdk.auth.logout(),
    ...options,
  })
}
