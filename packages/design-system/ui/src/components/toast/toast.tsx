"use client"

import {
  CheckCircleSolid,
  ExclamationCircleSolid,
  InformationCircleSolid,
  Spinner,
  XCircleSolid,
} from "@medusajs/icons"
import * as Primitives from "@radix-ui/react-toast"
import * as React from "react"

import { clx } from "@/utils/clx"

const ToastProvider = Primitives.Provider
ToastProvider.displayName = "ToastProvider"

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof Primitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof Primitives.Viewport>
>(({ className, ...props }, ref) => (
  <Primitives.Viewport
    ref={ref}
    className={clx(
      "fixed right-0 top-0 z-[9999] w-full p-6 md:max-w-[484px]",
      className
    )}
    {...props}
  />
))
ToastViewport.displayName = "Toast.Viewport"

interface ActionProps {
  label: string
  altText: string
  onClick: () => void | Promise<void>
}

interface ToastProps
  extends React.ComponentPropsWithoutRef<typeof Primitives.Root> {
  variant?: "info" | "success" | "warning" | "error" | "loading"
  title?: string
  description?: string
  action?: ActionProps
  disableDismiss?: boolean
}

/**
 * This component is based on the [Radix UI Toast](https://www.radix-ui.com/primitives/docs/components/toast) primitives.
 * 
 * @excludeExternal
 */
const Toast = React.forwardRef<
  React.ElementRef<typeof Primitives.Root>,
  ToastProps
>(
  (
    {
      className,
      /**
       * The toast's style.
       */
      variant,
      /**
       * The toast's title.
       */
      title,
      /**
       * The toast's content.
       */
      description,
      /**
       * The actions to show in the toast as buttons.
       */
      action,
      /**
       * Whether to hide the Close button.
       */
      disableDismiss = false,
      ...props
    }: ToastProps,
    ref
  ) => {
    let Icon = undefined

    switch (variant) {
      case "success":
        Icon = <CheckCircleSolid className="text-ui-tag-green-icon" />
        break
      case "warning":
        Icon = <ExclamationCircleSolid className="text-ui-tag-orange-icon" />
        break
      case "error":
        Icon = <XCircleSolid className="text-ui-tag-red-icon" />
        break
      case "loading":
        Icon = <Spinner className="text-ui-tag-blue-icon animate-spin" />
        break
      default:
        Icon = <InformationCircleSolid className="text-ui-fg-base" />
        break
    }

    if (action && !action.altText) {
      // eslint-disable-next-line turbo/no-undeclared-env-vars
      if (process.env.NODE_ENV === "development") {
        console.warn(
          "Omitting `altText` from the action is not recommended. Please provide a description for screen readers."
        )
      }
    }

    return (
      <Primitives.Root
        ref={ref}
        className={clx(
          "bg-ui-bg-base border-ui-border-base flex h-fit min-h-[74px] w-full overflow-hidden rounded-md border shadow-[0_4px_12px_rgba(0,0,0,0.05)] md:max-w-[440px]",
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none",
          className
        )}
        {...props}
      >
        <div className="border-ui-border-base flex flex-1 items-start space-x-3 border-r p-4">
          <span aria-hidden>{Icon}</span>
          <div>
            {title && (
              <Primitives.Title className="text-ui-fg-base txt-compact-small-plus">
                {title}
              </Primitives.Title>
            )}
            {description && (
              <Primitives.Description className="text-ui-fg-subtle txt-compact-medium">
                {description}
              </Primitives.Description>
            )}
          </div>
        </div>
        <div className="flex flex-col">
          {action && (
            <>
              <Primitives.Action
                altText={action.altText}
                className={clx(
                  "txt-compact-small-plus text-ui-fg-base bg-ui-bg-base hover:bg-ui-bg-base-hover active:bg-ui-bg-base-pressed flex flex-1 items-center justify-center px-6 transition-colors",
                  {
                    "text-ui-fg-error": variant === "error",
                  }
                )}
                onClick={(e) => {
                  e.preventDefault()
                  action.onClick()
                }}
                type="button"
              >
                {action.label}
              </Primitives.Action>
              <div className="bg-ui-border-base h-px w-full" />
            </>
          )}
          {!disableDismiss && (
            <Primitives.Close
              className={clx(
                "txt-compact-small-plus text-ui-fg-subtle bg-ui-bg-base hover:bg-ui-bg-base-hover active:bg-ui-bg-base-pressed flex flex-1 items-center justify-center px-6 transition-colors",
                {
                  "h-1/2": action,
                  "h-full": !action,
                }
              )}
              aria-label="Close"
            >
              Close
            </Primitives.Close>
          )}
        </div>
      </Primitives.Root>
    )
  }
)
Toast.displayName = "Toast"

type ToastActionElement = ActionProps

export {
  Toast,
  ToastProvider,
  ToastViewport,
  type ToastActionElement,
  type ToastProps,
}
