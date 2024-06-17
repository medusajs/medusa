import { ExclamationCircle } from "@medusajs/icons"
import { Text } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { Navigate, useLocation, useRouteError } from "react-router-dom"

import { isFetchError } from "../../../lib/is-fetch-error"
import { InlineTip } from "../../common/inline-tip"

// WIP - Need to allow wrapping <Outlet> with ErrorBoundary for more granular error handling.
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
        <DevelopmentStack error={error} />
      </div>
    </div>
  )
}

/**
 * Component that renders an error stack trace in development mode.
 *
 * We don't want to show stack traces in production, so this component is only
 * rendered when the `NODE_ENV` is set to `development`.
 *
 * The reason for adding this is that `react-router-dom` can swallow certain types
 * of errors, e.g. a missing export from a module that is exported, and will instead
 * log a vague warning related to the route not exporting a Component.
 */
const DevelopmentStack = ({ error }: { error: unknown }) => {
  const stack = error instanceof Error ? error.stack : null
  const [stackType, stackMessage] = stack?.split(":") ?? ["", ""]
  const isDevelopment = process.env.NODE_ENV === "development"

  if (!isDevelopment) {
    return null
  }

  return (
    <InlineTip
      variant="warning"
      label={stackType}
      className="mx-auto w-full max-w-[500px]"
    >
      <span className="font-mono">{stackMessage}</span>
    </InlineTip>
  )
}
