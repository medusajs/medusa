import { Spinner } from "@medusajs/icons"
import type { AuthTypes } from "@medusajs/types"
import { Button, Text, toast } from "@medusajs/ui"
import type { TFunction } from "i18next"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { decodeToken } from "react-jwt"
import { useNavigate, useSearchParams } from "react-router-dom"

import { AuthProvider, provisionAuthUser } from "../../../hooks/api"
import { isFetchError } from "../../../lib/is-fetch-error"
import { sdk } from "../../../lib/client"
import { getRedirectProviders, hasEmailPassProvider } from "../utils"
import { CLOUD_AUTH_PROVIDER } from "./cloud-auth-login"

type SsoLoginProps = {
  providers: AuthProvider[]
  onMfaChallenge?: (
    challenge: AuthTypes.AuthMfaChallengeDTO,
    onSuccess: (token: string) => void | Promise<void>
  ) => void
}

export const SsoLogin = ({ providers, onMfaChallenge }: SsoLoginProps) => {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()

  const redirectProviders = useMemo(
    () =>
      getRedirectProviders(providers).filter(
        (provider) => provider.id !== CLOUD_AUTH_PROVIDER
      ),
    [providers]
  )

  const callbackProviderId = searchParams.get("auth_provider")
  const isCallback =
    !!callbackProviderId &&
    callbackProviderId !== CLOUD_AUTH_PROVIDER &&
    (searchParams.has("code") || searchParams.has("error"))

  const showDivider = hasEmailPassProvider(providers)

  const { handleLogin, pendingProviderId } = useHandleLogin()
  const { handleCallback, isCallbackPending } = useAuthCallback(
    callbackProviderId,
    searchParams,
    onMfaChallenge
  )

  // ref to prevent duplicate calls in React strict mode and other
  // unmounting+mounting scenarios
  const actionInitiated = useRef(false)
  useEffect(() => {
    if (actionInitiated.current) {
      return
    }

    if (isCallback) {
      actionInitiated.current = true
      handleCallback()
    }
  }, [isCallback, handleCallback])

  // Render full-screen overlay during the callback to hide the login form
  if (isCallback) {
    return (
      <div className="bg-ui-bg-subtle fixed inset-0 z-50 flex items-center justify-center">
        <Spinner className="text-ui-fg-subtle animate-spin" />
      </div>
    )
  }

  if (!redirectProviders.length) {
    return null
  }

  const isPending = !!pendingProviderId || isCallbackPending

  return (
    <div className="flex w-full flex-col gap-y-3">
      {showDivider && <OrDivider />}
      {redirectProviders.map((provider) => {
        return (
          <Button
            key={provider.id}
            variant="secondary"
            onClick={() => handleLogin(provider.id)}
            className="w-full"
            disabled={isPending}
            isLoading={pendingProviderId === provider.id || isCallbackPending}
          >
            {t("auth.login.continueWithProvider", {
              provider: provider.display_name,
            })}
          </Button>
        )
      })}
    </div>
  )
}

const OrDivider = () => {
  const { t } = useTranslation()

  return (
    <div className="flex items-center gap-x-3">
      <hr className="bg-ui-border-base h-px flex-1 border-0" />
      <Text size="small" leading="compact" className="text-ui-fg-muted">
        {t("auth.login.or")}
      </Text>
      <hr className="bg-ui-border-base h-px flex-1 border-0" />
    </div>
  )
}

const useHandleLogin = () => {
  const { t } = useTranslation()
  const [pendingProviderId, setPendingProviderId] = useState<string | null>(
    null
  )

  // Not using useMutation from @tanstack/react-query because it doesn't play
  // well with strict mode when invoked only once from a useEffect. The issue is
  // that the first instance of the mutation is invoked but quickly canceled upon
  // the second mounting of the component, and its status gets stuck at pending.
  const handleLogin = useCallback(
    async (providerId: string) => {
      setPendingProviderId(providerId)
      try {
        const result = await sdk.auth.login("user", providerId, {
          // setting callback_url in case the admin is on a different domain, or
          // the backend URL is set to just "/" which won't work for the callback
          callback_url: `${window.location.origin}${window.location.pathname}?auth_provider=${providerId}`,
        })

        if (typeof result === "object" && "location" in result) {
          // Redirect to the identity provider for authentication
          window.location.href = result.location
          return
        }

        throw new Error("Unexpected login response")
      } catch {
        toast.error(t("auth.login.authenticationFailed"))
        setPendingProviderId(null)
      }
    },
    [t]
  )

  return { handleLogin, pendingProviderId }
}

const useAuthCallback = (
  providerId: string | null,
  searchParams: URLSearchParams,
  onMfaChallenge?: (
    challenge: AuthTypes.AuthMfaChallengeDTO,
    onSuccess: (token: string) => void | Promise<void>
  ) => void
) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [isPending, setIsPending] = useState(false)

  const ensureUser = useCallback(
    async (token: string) => {
      const decodedToken = decodeToken(token) as {
        actor_id?: string
      } | null

      // If the token has no actor linked yet, provision the user and refresh the
      // token so it comes back with the actor_id set.
      if (!decodedToken?.actor_id && providerId) {
        await provisionAuthUser(providerId, token)

        const refreshedToken = await sdk.auth.refresh({
          Authorization: `Bearer ${token}`, // passing it manually in case the auth type is session
        })
        if (!refreshedToken) {
          throw new Error("Failed to refresh token after user provisioning")
        }
      }
    },
    [providerId]
  )

  // Not using useMutation from @tanstack/react-query because it doesn't play
  // well with strict mode when invoked only once from a useEffect (see note in
  // useHandleLogin).
  const handleCallback = useCallback(async () => {
    if (!providerId) {
      return
    }

    setIsPending(true)
    try {
      let token: string
      try {
        const query = Object.fromEntries(searchParams)
        delete query.auth_provider

        const result = await sdk.auth.callback("user", providerId, query)

        if (typeof result === "object" && "mfa_challenge" in result) {
          if (!onMfaChallenge) {
            throw new Error("MFA challenge handler is missing")
          }

          onMfaChallenge(result.mfa_challenge, async (verifiedToken) => {
            try {
              await ensureUser(verifiedToken)
              navigate("/")
            } catch (error) {
              toast.error(resolveProvisionError(error, t))
              navigate("/login")
            }
          })
          return
        }

        if (typeof result === "object" && "verification_required" in result) {
          throw new Error("Verification required but not implemented yet")
        }

        token = result
      } catch (error) {
        throw new AuthCallbackError(t("auth.login.authenticationFailed"))
      }

      try {
        await ensureUser(token)
      } catch (error) {
        throw new AuthCallbackError(resolveProvisionError(error, t))
      }

      navigate("/")
    } catch (error) {
      toast.error(
        error instanceof AuthCallbackError
          ? error.message
          : t("auth.login.authenticationFailed")
      )
      // Navigate to /login without the query string, otherwise a failed
      // callback would get stuck on the spinner. There's no point in keeping the
      // query string anyway because the callback would just fail again.
      navigate("/login")
    }

    setIsPending(false)
  }, [providerId, searchParams, t, onMfaChallenge, ensureUser, navigate])

  return { handleCallback, isCallbackPending: isPending }
}

class AuthCallbackError extends Error {}

// The provisioning route returns user-friendly messages, so we surface the
// backend message when available and fall back to a generic string otherwise.
const resolveProvisionError = (error: unknown, t: TFunction): string => {
  if (isFetchError(error) && error.message) {
    return error.message
  }

  return t("auth.login.provisioningFailed")
}
