import React, { FC, HTMLAttributes, ReactNode } from "react"
import clsx from "clsx"
import {
  BellAlertIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid"

export interface AlertAction {
  label: string
  onClick: () => void
}

export interface AlertProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  variant: "primary" | "danger" | "success" | "warning" | "default"
  size?: "small" | "medium" | "large"
  icon?: FC<HTMLAttributes<SVGElement>> | null
  title?: ReactNode
  content?: ReactNode
  actions?: AlertAction[]
  onDismiss?: () => void
}

const Alert: FC<AlertProps> = ({
  children,
  variant,
  size,
  className,
  icon,
  title,
  content,
  actions,
  onDismiss,
  ...props
}) => {
  const variantClassName = clsx({
    ["alert--primary"]: variant === "primary",
    ["alert--danger"]: variant === "danger",
    ["alert--success"]: variant === "success",
    ["alert--warning"]: variant === "warning",
    ["alert--default"]: variant === "default",
  })

  const icons = {
    primary: BellAlertIcon,
    danger: XCircleIcon,
    success: CheckCircleIcon,
    warning: ExclamationTriangleIcon,
    default: InformationCircleIcon,
  }

  const Icon = typeof icon !== "undefined" ? icon : icons[variant]

  return (
    <div
      className={clsx("alert rounded-md p-4", variantClassName, className)}
      {...props}
    >
      <div className="flex gap-3">
        {!!Icon && (
          <div className="alert__icon flex-shrink-0 mt-[2px]">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>
        )}

        <div className={clsx("flex flex-col items-start")}>
          <div className="flex flex-col gap-0.5">
            {title && (
              <h3 className="alert__title inter-base-semibold">{title}</h3>
            )}
            {(content || children) && (
              <div className="alert__content inter-base-regular">
                {content || children}
              </div>
            )}
          </div>

          <div className="flex-1" />

          {actions && (
            <div className="mt-1 -ml-3 -mb-1 actions flex-shrink-0 flex items-center gap-2">
              {actions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.onClick}
                  className="alert__action rounded-md px-3 py-1.5 inter-base-semibold leading-small focus:outline-none focus:ring-2 focus:ring-offset-2"
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex-1" />

        {onDismiss && (
          <div>
            <button
              type="button"
              className="alert__dismiss inline-flex items-center rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-offset-2"
              onClick={onDismiss}
            >
              <span className="sr-only">Dismiss</span>
              <XMarkIcon className="flex-shrink-0 h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Alert
