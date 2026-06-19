import {
  AuthLoginResponse,
  AuthRegisterResponse,
  FetchError,
} from "@medusajs/js-sdk"
import { HttpTypes } from "@medusajs/types"
import { UseMutationOptions, useMutation } from "@tanstack/react-query"
import { sdk } from "../../lib/client"

export const useSignInWithEmailPass = (
  options?: UseMutationOptions<
    AuthLoginResponse,
    FetchError,
    HttpTypes.AdminSignUpWithEmailPassword
  >
) => {
  return useMutation({
    mutationFn: (payload) =>
      sdk.auth.login(
        "user",
        "emailpass",
        payload
      ) as Promise<AuthLoginResponse>,
    onSuccess: async (data, variables, context) => {
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useSignUpWithEmailPass = (
  options?: UseMutationOptions<
    AuthRegisterResponse,
    FetchError,
    HttpTypes.AdminSignInWithEmailPassword
  >
) => {
  return useMutation({
    mutationFn: (payload) => sdk.auth.register("user", "emailpass", payload),
    onSuccess: async (data, variables, context) => {
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useResetPasswordForEmailPass = (
  options?: UseMutationOptions<void, FetchError, { email: string }>
) => {
  return useMutation({
    mutationFn: (payload) =>
      sdk.auth.resetPassword("user", "emailpass", {
        identifier: payload.email,
      }),
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

export const useUpdateProviderForEmailPass = (
  token: string,
  options?: UseMutationOptions<void, FetchError, HttpTypes.AdminUpdateProvider>
) => {
  return useMutation({
    mutationFn: (payload) =>
      sdk.auth.updateProvider("user", "emailpass", payload, token),
    onSuccess: async (data, variables, context) => {
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}
