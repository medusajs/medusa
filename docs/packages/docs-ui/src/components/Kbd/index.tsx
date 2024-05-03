import React from "react"
import clsx from "clsx"

export type KbdProps = React.ComponentProps<"kbd">

export const Kbd = ({ children, className, ...props }: KbdProps) => {
  return (
    <kbd
      className={clsx(
        "rounded-docs_sm border-solid py-0 px-[6px]",
        "inline-flex items-center justify-center",
        "border-medusa-tag-neutral-border border",
        "bg-medusa-tag-neutral-bg",
        "text-medusa-tag-neutral-text",
        "text-compact-x-small-plus font-base shadow-none",
        className
      )}
      {...props}
    >
      {children}
    </kbd>
  )
}
