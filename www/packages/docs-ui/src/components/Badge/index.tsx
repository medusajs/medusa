import React from "react"
import clsx from "clsx"

export type BadgeVariant =
  | "purple"
  | "orange"
  | "green"
  | "blue"
  | "red"
  | "neutral"
  | "code"

export type BadgeProps = {
  className?: string
  variant: BadgeVariant
} & React.HTMLAttributes<HTMLSpanElement>

export const Badge = ({ className, variant, children }: BadgeProps) => {
  return (
    <span
      className={clsx(
        "text-compact-x-small-plus px-docs_0.25 py-0 rounded-docs_sm border border-solid text-center",
        variant === "purple" &&
          "bg-medusa-tag-purple-bg text-medusa-tag-purple-text border-medusa-tag-purple-border",
        variant === "orange" &&
          "bg-medusa-tag-orange-bg text-medusa-tag-orange-text border-medusa-tag-orange-border",
        variant === "green" &&
          "bg-medusa-tag-green-bg text-medusa-tag-green-text border-medusa-tag-green-border",
        variant === "blue" &&
          "bg-medusa-tag-blue-bg text-medusa-tag-blue-text border-medusa-tag-blue-border",
        variant === "red" &&
          "bg-medusa-tag-red-bg text-medusa-tag-red-text border-medusa-tag-red-border",
        variant === "neutral" &&
          "bg-medusa-tag-neutral-bg text-medusa-tag-neutral-text border-medusa-tag-neutral-border",
        variant === "code" &&
          "bg-medusa-contrast-bg-subtle text-medusa-contrast-fg-secondary border-medusa-contrast-border-bot",
        // needed for tailwind utilities
        "badge",
        className
      )}
    >
      {children}
    </span>
  )
}
