"use client"

import { clx } from "@/utils/clx"
import * as React from "react"

const ALLOWED_KEYS = ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"]

export const DatePickerClearButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<"button">
>(({ type = "button", className, children, ...props }, ref) => {
  /**
   * Allows the button to be used with only the keyboard.
   * Otherwise the wrapping component will hijack the event.
   */
  const stopPropagation = (e: React.KeyboardEvent) => {
    if (!ALLOWED_KEYS.includes(e.key)) {
      e.stopPropagation()
    }
  }

  return (
    <button
      ref={ref}
      type={type}
      className={clx(
        "text-ui-fg-muted rounded-sm outline-none transition-fg",
        "hover:bg-ui-bg-base-hover",
        "focus-visible:shadow-borders-interactive-with-active",
        className
      )}
      onKeyDown={stopPropagation}
      {...props}
    >
      {children}
    </button>
  )
})
DatePickerClearButton.displayName = "DatePickerClearButton"
