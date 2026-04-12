import { ExclamationCircle, SquareTwoStack } from "@medusajs/icons"
import { toast, Text, IconButton, Tooltip } from "@medusajs/ui"
import copy from "copy-to-clipboard"
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

  // In development mode, show detailed error information
  const isDevelopment = process.env.NODE_ENV === "development"
  const errorMessage = error instanceof Error ? error.message : String(error)
  const errorStack = error instanceof Error ? error.stack : undefined

  /**
   * Log error in development mode.
   *
   * react-router-dom will sometimes swallow the error,
   * so this ensures that we always log it.
   */
  if (process.env.NODE_ENV === "development") {
    console.error(error)
    const fileDetails = errorStack?.split("\n")[1]?.trim()
    const filename = fileDetails?.match(/([^\/\\?]+)(?:\?[^:]*)?:\d+:\d+\)/)?.[1] || "unknown"
    const lineno = fileDetails?.match(/(?:\?[^:]*)?:(\d+):\d+\)/)?.[1] || "unknown"
    const colno = fileDetails?.match(/(?:\?[^:]*)?:\d+:(\d+)\)/)?.[1] || "unknown"
    window.parent.postMessage({
      data: {
        type: "RUNTIME_ERROR",
        level: "error",
        message: errorMessage,
        stack: errorStack,
        logged_at: new Date().toISOString(),
        filename,
        lineno,
        colno,
      }
    }, "*")
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

  const handleCopyError = () => {
    const errorText = `Error: ${errorMessage}\n\n${errorStack || "No stack trace available"}`
    const success = copy(errorText)
    
    if (success) {
      toast.success("Error details copied to clipboard")
    } else {
      toast.error("Failed to copy error details")
    }
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
        {isDevelopment && errorMessage && (
          <div className="bg-ui-bg-disabled border-ui-border-subtle max-w-3xl overflow-scroll max-h-[400px] rounded-lg border p-4">
            <div className="flex flex-col gap-y-4">
              <div className="flex items-center justify-between">
                <Text
                  size="small"
                  weight="plus"
                  className="text-ui-fg-base"
                >
                  Error Details (Development Mode)
                </Text>
                <Tooltip content="Copy error details">
                  <IconButton
                    onClick={handleCopyError}
                    variant="transparent"
                  >
                    <SquareTwoStack className="text-ui-fg-muted" />
                  </IconButton>
                </Tooltip>
              </div>
              <div>
                <Text
                  size="xsmall"
                  className="text-ui-fg-subtle font-mono break-words"
                >
                  {errorMessage}
                </Text>
              </div>
              {errorStack && (
                <div>
                  <Text
                    size="small"
                    weight="plus"
                    className="text-ui-fg-base mb-2"
                  >
                    Stack Trace
                  </Text>
                  <pre className="text-ui-fg-subtle overflow-auto whitespace-pre-wrap break-words text-xs">
                    {errorStack}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
