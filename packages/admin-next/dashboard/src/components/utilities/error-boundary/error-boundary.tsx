import { Navigate, useLocation, useRouteError } from "react-router-dom"

import { ExclamationCircle } from "@medusajs/icons"
import { Text } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { isAxiosError } from "../../../lib/is-axios-error"

// WIP - Need to allow wrapping <Outlet> with ErrorBoundary for more granular error handling.
export const ErrorBoundary = () => {
  const error = useRouteError()
  const location = useLocation()
  const { t } = useTranslation()

  let code: number | null = null

  if (isAxiosError(error)) {
    if (error.response?.status === 401) {
      return <Navigate to="/login" state={{ from: location }} replace />
    }

    code = error.response?.status ?? null
  }

  let title: string
  let message: string

  switch (code) {
    case 400:
      title = t("errorBoundary.badRequestTitle")
      message = t("errorBoundary.badRequestMessage")
      break
    case 404:
      title = t("errorBoundary.notFoundTitle")
      message = t("errorBoundary.notFoundMessage")
      break
    case 500:
      title = t("errorBoundary.internalServerErrorTitle")
      message = t("errorBoundary.internalServerErrorMessage")
      break
    default:
      title = t("errorBoundary.defaultTitle")
      message = t("errorBoundary.defaultMessage")
      break
  }

  return (
    <div className="flex size-full min-h-screen items-center justify-center">
      <div className="text-ui-fg-subtle flex flex-col items-center gap-y-2">
        <ExclamationCircle />
        <Text size="small" leading="compact" weight="plus">
          {title}
        </Text>
        <Text size="small" className="text-ui-fg-muted">
          {message}
        </Text>
      </div>
    </div>
  )
}
