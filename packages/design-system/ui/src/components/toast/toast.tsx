import {
  CheckCircleSolid,
  ExclamationCircleSolid,
  InformationCircleSolid,
  Spinner,
  XCircleSolid,
  XMark,
} from "@medusajs/icons"
import * as React from "react"

import type { ToastAction, ToastVariant } from "@/types"
import { clx } from "@/utils/clx"
import { IconButton } from "../icon-button"

interface ToastComponentProps {
  id: string | number
  variant?: ToastVariant
  title: string
  description?: string
  action?: ToastAction
  onDismiss?: () => void
}

/**
 * This component is based on the [Sonner](https://sonner.emilkowal.ski/toast) toast library.
 */
export const Toast = ({
  /**
   * Optional ID of the toast.
   */
  id,
  /**
   * @ignore
   *
   * @privateRemarks
   * As the Toast component is created using
   * the `toast` utility functions, the variant is inferred
   * from the utility function.
   */
  variant = "info",
  /**
   * @ignore
   *
   * @privateRemarks
   * The `toast` utility functions accept this as a parameter.
   */
  title,
  /**
   * The toast's text.
   */
  description,
  /**
   * The toast's action buttons.
   */
  action,
  /**
   * @ignore
   *
   * @privateRemarks
   * The `toast` utility functions don't allow
   * passing this prop.
   */
  onDismiss,
}: ToastComponentProps) => {
  let icon = undefined

  switch (variant) {
    case "success":
      icon = <CheckCircleSolid className="text-ui-tag-green-icon" />
      break
    case "warning":
      icon = <ExclamationCircleSolid className="text-ui-tag-orange-icon" />
      break
    case "error":
      icon = <XCircleSolid className="text-ui-tag-red-icon" />
      break
    case "loading":
      icon = <Spinner className="text-ui-tag-blue-icon animate-spin" />
      break
    case "info":
      icon = <InformationCircleSolid className="text-ui-fg-base" />
      break
    default:
      break
  }

  return (
    <div className="shadow-elevation-flyout bg-ui-bg-base flex w-fit min-w-[360px] max-w-[440px] gap-x-3 overflow-hidden rounded-lg p-3">
      <div
        className={clx("grid flex-1 items-start gap-2", {
          "grid-cols-[20px_1fr]": !!icon,
          "grid-cols-1": !icon,
        })}
      >
        {!!icon && (
          <span className="flex size-5 items-center justify-center" aria-hidden>
            {icon}
          </span>
        )}
        <div className="flex flex-col gap-y-3">
          <div className="flex flex-col">
            <span className="txt-compact-small-plus text-ui-fg-base">
              {title}
            </span>
            {description && (
              <span className="txt-small text-ui-fg-subtle text-pretty">
                {description}
              </span>
            )}
          </div>
          {!!action && (
            <button
              type="button"
              className={clx(
                "txt-compact-small-plus text-ui-fg-base bg-ui-bg-base flex w-fit items-center rounded-[4px] transition-colors",
                "focus-visible:shadow-borders-focus",
                "hover:text-ui-fg-subtle",
                "disabled:text-ui-fg-disabled",
                {
                  "text-ui-fg-error": action.variant === "destructive",
                }
              )}
              onClick={action.onClick}
            >
              {action.label}
            </button>
          )}
        </div>
      </div>
      {!!onDismiss && (
        <div>
          <IconButton
            size="2xsmall"
            variant="transparent"
            type="button"
            onClick={onDismiss}
          >
            <XMark />
          </IconButton>
        </div>
      )}
    </div>
  )
}
