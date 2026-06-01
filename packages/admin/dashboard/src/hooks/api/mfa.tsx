import type {
  AuthMfaFactorResponse,
  AuthMfaListResponse,
  AuthMfaRecoveryCodesResponse,
  AuthMfaSetupResponse,
  FetchError,
} from "@medusajs/js-sdk"
import type { AuthTypes } from "@medusajs/types"
import {
  QueryKey,
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
} from "@tanstack/react-query"
import { sdk } from "../../lib/client"
import { queryClient } from "../../lib/query-client"
import { queryKeysFactory } from "../../lib/query-key-factory"

const MFA_QUERY_KEY = "mfa" as const
export const mfaQueryKeys = queryKeysFactory(MFA_QUERY_KEY)

export const callbackWithCloudAuth = async (
  query: Record<string, unknown>
): ReturnType<typeof sdk.auth.callback> =>
  sdk.auth.callback("user", "cloud", query)

export const useAuthMfa = (
  options?: Omit<
    UseQueryOptions<
      AuthMfaListResponse,
      FetchError,
      AuthMfaListResponse,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => sdk.auth.mfa.list(),
    queryKey: mfaQueryKeys.lists(),
    ...options,
  })

  return { ...data, ...rest }
}

export const useStartAuthMfa = (
  options?: UseMutationOptions<
    AuthMfaSetupResponse,
    FetchError,
    {
      provider: AuthTypes.AuthMfaProvider
      label?: string | null
      issuer?: string
      metadata?: Record<string, unknown> | null
    }
  >
) => {
  return useMutation({
    mutationFn: (payload) => sdk.auth.mfa.start(payload),
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: mfaQueryKeys.lists() })
      options?.onSuccess?.(data, variables, context)
    },
  })
}

export const useVerifyAuthMfa = (
  id: string,
  options?: UseMutationOptions<
    AuthMfaFactorResponse,
    FetchError,
    { code: string }
  >
) => {
  return useMutation({
    mutationFn: (payload) => sdk.auth.mfa.verify(id, payload),
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: mfaQueryKeys.lists() })
      options?.onSuccess?.(data, variables, context)
    },
  })
}

export const useDisableAuthMfa = (
  id: string,
  options?: UseMutationOptions<
    AuthMfaFactorResponse,
    FetchError,
    { method?: AuthTypes.AuthMfaChallengeMethod; code?: string } | void
  >
) => {
  return useMutation({
    mutationFn: (payload) => sdk.auth.mfa.disable(id, payload ?? {}),
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: mfaQueryKeys.lists() })
      options?.onSuccess?.(data, variables, context)
    },
  })
}

export const useGenerateAuthMfaRecoveryCodes = (
  options?: UseMutationOptions<
    AuthMfaRecoveryCodesResponse,
    FetchError,
    { count?: number } | void
  >
) => {
  return useMutation({
    mutationFn: (payload) => sdk.auth.mfa.generateRecoveryCodes(payload ?? {}),
    ...options,
  })
}

export const useVerifyAuthMfaChallenge = (
  options?: UseMutationOptions<
    string,
    FetchError,
    { id: string; method: AuthTypes.AuthMfaChallengeMethod; code: string }
  >
) => {
  return useMutation({
    mutationFn: ({ id, method, code }) =>
      sdk.auth.mfa.verifyChallenge(id, { method, code }),
    ...options,
  })
}
