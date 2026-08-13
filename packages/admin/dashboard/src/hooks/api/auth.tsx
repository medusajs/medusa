import {
  AuthLoginResponse,
  AuthRegisterResponse,
  FetchError,
} from "@medusajs/js-sdk"
import { HttpTypes } from "@medusajs/types"
import {
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
} from "@tanstack/react-query"
import { sdk } from "../../lib/client"

/**
 * Public information about an auth provider registered for the `user` actor,
 * as returned by `GET /auth/user/providers`.
 */
export type AuthProvider = HttpTypes.AuthProvider

export const authProvidersQueryKey = ["auth", "providers"] as const

/**
 * Fetches the auth providers available for the `user` actor. This is a public,
 * pre-auth endpoint, so no authenticated session is required.
 */
export const useAuthProviders = (
  options?: Omit<
    UseQueryOptions<HttpTypes.AuthProvidersListResponse, FetchError>,
    "queryKey" | "queryFn"
  >
) => {
  const { data, ...rest } = useQuery({
    queryKey: authProvidersQueryKey,
    queryFn: async () => sdk.auth.listProviders("user"),
    staleTime: 5 * 60 * 1000,
    ...options,
  })

  return { ...data, ...rest }
}

export const provisionAuthUser = async (
  provider: string,
  token: string
): Promise<void> => {
  await sdk.auth.createUser(provider, {
    Authorization: `Bearer ${token}`,
  })
}

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
