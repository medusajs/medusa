"use client"

import * as React from "react"

export const DatePickerClearButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<"button">
>(({ type = "button", children, ...props }, ref) => {
  return (
    <button ref={ref} type={type} {...props}>
      {children}
    </button>
  )
})
DatePickerClearButton.displayName = "DatePickerClearButton"
