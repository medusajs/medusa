import React from "react"
import clsx from "clsx"

export type BadgeProps = {
  className?: string
  variant: string
} & React.HTMLAttributes<HTMLSpanElement>

const Badge: React.FC<BadgeProps> = ({ className, variant, children }) => {
  return (
    <span
      className={clsx(
        "text-compact-x-small-plus py-px px-0.4 rounded-sm border border-solid text-center",
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
        "badge",
        className
      )}
    >
      {children}
    </span>
  )
}

export default Badge
