import React from "react"
import clsx from "clsx"

export type KbdProps = React.ComponentProps<"kbd">

export const Kbd = ({ children, className, ...props }: KbdProps) => {
  return (
    <kbd
      className={clsx(
        "rounded-docs_xs border-solid border border-medusa-border-base",
        "inline-flex items-center justify-center",
        "py-0 px-docs_0.25",
        "bg-medusa-bg-field",
        "text-medusa-fg-subtle",
        "text-compact-x-small-plus font-base shadow-none",
        className
      )}
      {...props}
    >
      {children}
    </kbd>
  )
}
