import { ExclamationCircle } from "@medusajs/icons"
import { Text } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { Navigate, useLocation, useRouteError } from "react-router-dom"

import { isFetchError } from "../../../lib/is-fetch-error"

export const ErrorBoundary = () => {
  const error = useRouteError()
  const location = useLocation()
  const { t } = useTranslation()

  let code: number | null = null

  if (isFetchError(error)) {
    if (error.status === 401) {
      return <Navigate to="/login" state={{ from: location }} replace />
    }

    code = error.status ?? null
  }

  /**
   * Log error in development mode.
   *
   * react-router-dom will sometimes swallow the error,
   * so this ensures that we always log it.
   */
  if (process.env.NODE_ENV === "development") {
    console.error(error)
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
    <div className="flex size-full min-h-[calc(100vh-57px-24px)] items-center justify-center">
      <div className="flex flex-col gap-y-6">
        <div className="text-ui-fg-subtle flex flex-col items-center gap-y-3">
          <ExclamationCircle />
          <div className="flex flex-col items-center justify-center gap-y-1">
            <Text size="small" leading="compact" weight="plus">
              {title}
            </Text>
            <Text
              size="small"
              className="text-ui-fg-muted text-balance text-center"
            >
              {message}
            </Text>
          </div>
        </div>
      </div>
    </div>
  )
}
