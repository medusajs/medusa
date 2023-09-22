import React from "react"
import clsx from "clsx"

export type BadgeVariant =
  | "purple"
  | "purple-dark"
  | "orange"
  | "orange-dark"
  | "green"
  | "green-dark"
  | "blue"
  | "blue-dark"
  | "red"
  | "neutral"

export type BadgeProps = {
  className?: string
  variant: BadgeVariant
} & React.HTMLAttributes<HTMLSpanElement>

export const Badge = ({ className, variant, children }: BadgeProps) => {
  return (
    <span
      className={clsx(
        "text-compact-x-small-plus px-docs_0.4 rounded-docs_sm border border-solid py-px text-center",
        variant === "purple" &&
          "bg-medusa-tag-purple-bg dark:bg-medusa-tag-purple-bg-dark text-medusa-tag-purple-text dark:text-medusa-tag-purple-text-dark border-medusa-tag-purple-border dark:border-medusa-tag-purple-border-dark",
        variant === "purple-dark" &&
          "bg-medusa-tag-purple-bg-dark text-medusa-tag-purple-text-dark border-medusa-tag-purple-border-dark",
        variant === "orange" &&
          "bg-medusa-tag-orange-bg dark:bg-medusa-tag-orange-bg-dark text-medusa-tag-orange-text dark:text-medusa-tag-orange-text-dark border-medusa-tag-orange-border dark:border-medusa-tag-orange-border-dark",
        variant === "orange-dark" &&
          "bg-medusa-tag-orange-bg-dark text-medusa-tag-orange-text-dark border-medusa-tag-orange-border-dark",
        variant === "green" &&
          "bg-medusa-tag-green-bg dark:bg-medusa-tag-green-bg-dark text-medusa-tag-green-text dark:text-medusa-tag-green-text-dark border-medusa-tag-green-border dark:border-medusa-tag-green-border-dark",
        variant === "green-dark" &&
          "bg-medusa-tag-green-bg-dark text-medusa-tag-green-text-dark border-medusa-tag-green-border-dark",
        variant === "blue" &&
          "bg-medusa-tag-blue-bg dark:bg-medusa-tag-blue-bg-dark text-medusa-tag-blue-text dark:text-medusa-tag-blue-text-dark border-medusa-tag-blue-border dark:border-medusa-tag-blue-border-dark",
        variant === "blue-dark" &&
          "bg-medusa-tag-blue-bg-dark text-medusa-tag-blue-text-dark border-medusa-tag-blue-border-dark",
        variant === "red" &&
          "bg-medusa-tag-red-bg dark:bg-medusa-tag-red-bg-dark text-medusa-tag-red-text dark:text-medusa-tag-red-text-dark border-medusa-tag-red-border dark:border-medusa-tag-red-border-dark",
        variant === "neutral" &&
          "bg-medusa-tag-neutral-bg dark:bg-medusa-tag-neutral-bg-dark text-medusa-tag-neutral-text dark:text-medusa-tag-neutral-text-dark border-medusa-tag-neutral-border dark:border-medusa-tag-neutral-border-dark",
        "badge",
        className
      )}
    >
      {children}
    </span>
  )
}
