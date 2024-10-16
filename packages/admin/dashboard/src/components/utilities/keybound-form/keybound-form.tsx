import React from "react"

/**
 * A form that can only be submitted when using the meta or control key.
 */
export const KeyboundForm = React.forwardRef<
  HTMLFormElement,
  React.FormHTMLAttributes<HTMLFormElement>
>(({ onSubmit, onKeyDown, ...rest }, ref) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit?.(event)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key === "Enter") {
      event.preventDefault()

      if (event.metaKey || event.ctrlKey) {
        handleSubmit(event)
      }
    }
  }

  return (
    <form
      {...rest}
      onSubmit={handleSubmit}
      onKeyDown={onKeyDown ?? handleKeyDown}
      ref={ref}
    />
  )
})

KeyboundForm.displayName = "KeyboundForm"
