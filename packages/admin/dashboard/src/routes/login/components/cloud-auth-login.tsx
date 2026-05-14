import { Spinner } from "@medusajs/icons"
import { Button, toast } from "@medusajs/ui"
import { useCallback, useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { decodeToken } from "react-jwt"
import { useNavigate, useSearchParams } from "react-router-dom"
import {
  useCloudAuthEnabled,
  useCreateCloudAuthUser,
} from "../../../hooks/api/cloud"
import { sdk } from "../../../lib/client"

const CLOUD_AUTH_PROVIDER = "cloud"

export const CloudAuthLogin = () => {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const { data: cloudAuth } = useCloudAuthEnabled()

  const isAutoLogin =
    searchParams.get("auth_provider") === CLOUD_AUTH_PROVIDER &&
    searchParams.get("auto") === "true"

  const isCallback =
    searchParams.get("auth_provider") === CLOUD_AUTH_PROVIDER &&
    (searchParams.has("code") || searchParams.has("error"))

  const { handleLogin, isLoginPending } = useHandleLogin(isAutoLogin)
  const { handleCallback, isCallbackPending } = useAuthCallback(searchParams)

  const actionInitiated = useRef(false) // ref to prevent duplicate calls in React strict mode and other unmounting+mounting scenarios
  useEffect(() => {
    if (actionInitiated.current) {
      return
    }

    if (isAutoLogin) {
      actionInitiated.current = true
      handleLogin()
    } else if (isCallback) {
      actionInitiated.current = true
      handleCallback()
    }
  }, [isAutoLogin, isCallback, handleLogin, handleCallback])

  // Render full-screen overlay during auto-login or callback to hide the login form
  if (isAutoLogin || isCallback) {
    return (
      <div className="bg-ui-bg-subtle fixed inset-0 z-50 flex items-center justify-center">
        <Spinner className="text-ui-fg-subtle animate-spin" />
      </div>
    )
  }

  // This check is last on purpose.
  // If it was first, the /app/login form would show briefly before being replaced by the above spinner.
  if (!cloudAuth?.enabled) {
    return null
  }

  // If it's not auto-login or callback, and the cloud auth is enabled, just show the login button.
  return (
    <>
      <hr className="bg-ui-border-base my-4" />
      <Button
        variant="secondary"
        onClick={handleLogin}
        className="w-full"
        disabled={isLoginPending || isCallbackPending}
        isLoading={isLoginPending || isCallbackPending}
      >
        {t("auth.login.cloud")}
      </Button>
    </>
  )
}

const useHandleLogin = (isAutoLogin: boolean) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [isPending, setIsPending] = useState(false)

  // Not using useMutation from @tanstack/react-query because it doesn't play well with strict mode when invoked only once from a useEffect.
  // The issue is that the first instance of the mutation is invoked but quickly canceled upon the second mounting of the component, and its status gets stuck at pending.
  const handleLogin = useCallback(async () => {
    setIsPending(true)
    try {
      const result = await sdk.auth.login("user", CLOUD_AUTH_PROVIDER, {
        // setting callback_url in case the admin is on a different domain, or the backend URL is set to just "/" which won't work for the callback
        callback_url: `${window.location.origin}${window.location.pathname}?auth_provider=${CLOUD_AUTH_PROVIDER}`,
      })

      if (typeof result === "object" && result.location) {
        // Redirect to Medusa Cloud for authentication
        window.location.href = result.location
        return
      }

      throw new Error("Unexpected login response")
    } catch {
      toast.error(t("auth.login.authenticationFailed"))
      if (isAutoLogin) {
        // Navigate to /login without query string cause otherwise a failed auto-login would get stuck on the spinner.
        // There's no point in using the query string anyway because the auto-login would just fail again.
        navigate("/login")
      }
    }

    setIsPending(false)
  }, [t, navigate, isAutoLogin])

  return { handleLogin, isLoginPending: isPending }
}

const useAuthCallback = (searchParams: URLSearchParams) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { mutateAsync: createCloudAuthUser } = useCreateCloudAuthUser()
  const [isPending, setIsPending] = useState(false)

  // Not using useMutation from @tanstack/react-query because it doesn't play well with strict mode when invoked only once from a useEffect.
  // The issue is that the first instance of the mutation is invoked but quickly canceled upon the second mounting of the component, and its status gets stuck at pending.
  const handleCallback = useCallback(async () => {
    setIsPending(true)
    try {
      let token: string
      try {
        const query = Object.fromEntries(searchParams)
        delete query.auth_provider // BE doesn't need this

        token = await sdk.auth.callback("user", CLOUD_AUTH_PROVIDER, query)
      } catch (error) {
        throw new Error("Authentication callback failed")
      }

      const decodedToken = decodeToken(token) as {
        actor_id: string
        user_metadata: Record<string, unknown>
      }

      // If user doesn't exist, create it
      if (!decodedToken?.actor_id) {
        await createCloudAuthUser()

        // Refresh token to get the updated token with actor_id
        const refreshedToken = await sdk.auth.refresh({
          Authorization: `Bearer ${token}`, // passing it manually in case the auth type is session
        })
        if (!refreshedToken) {
          throw new Error("Failed to refresh token after user creation")
        }
      }

      navigate("/")
    } catch (error) {
      toast.error(t("auth.login.authenticationFailed"))
      // Navigate to /login without query string cause otherwise a failed callback would get stuck on the spinner.
      // There's no point in using the query string anyway because the callback would just fail again.
      navigate("/login")
    }

    setIsPending(false)
  }, [searchParams, t, createCloudAuthUser, navigate])

  return { handleCallback, isCallbackPending: isPending }
}
