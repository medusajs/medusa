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
        "tw-text-label-x-small-plus tw-py-px tw-px-0.4 tw-rounded tw-border tw-border-solid tw-text-center",
        variant === "purple" &&
          "tw-bg-medusa-tag-purple-bg dark:tw-bg-medusa-tag-purple-bg-dark tw-text-medusa-tag-purple-text dark:tw-text-medusa-tag-purple-text-dark tw-border-medusa-tag-purple-border dark:tw-border-medusa-tag-purple-border-dark",
        variant === "orange" &&
          "tw-bg-medusa-tag-orange-bg dark:tw-bg-medusa-tag-orange-bg-dark tw-text-medusa-tag-orange-text dark:tw-text-medusa-tag-orange-text-dark tw-border-medusa-tag-orange-border dark:tw-border-medusa-tag-orange-border-dark",
        variant === "green" &&
          "tw-bg-medusa-tag-green-bg dark:tw-bg-medusa-tag-green-bg-dark tw-text-medusa-tag-green-text dark:tw-text-medusa-tag-green-text-dark tw-border-medusa-tag-green-border dark:tw-border-medusa-tag-green-border-dark",
        variant === "blue" &&
          "tw-bg-medusa-tag-blue-bg dark:tw-bg-medusa-tag-blue-bg-dark tw-text-medusa-tag-blue-text dark:tw-text-medusa-tag-blue-text-dark tw-border-medusa-tag-blue-border dark:tw-border-medusa-tag-blue-border-dark",
        className
      )}
    >
      {children}
    </span>
  )
}

export default Badge
