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
        "text-ui-fg-muted transition-fg flex size-full items-center justify-center outline-none",
        "hover:bg-ui-button-transparent-hover",
        "focus-visible:bg-ui-bg-interactive focus-visible:text-ui-fg-on-color",
        className
      )}
      aria-label="Clear date"
      onKeyDown={stopPropagation}
      {...props}
    >
      {children}
    </button>
  )
})
DatePickerClearButton.displayName = "DatePickerClearButton"
