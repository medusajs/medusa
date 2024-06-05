import React from "react"
import clsx from "clsx"
import { ShadedBgIcon } from "../.."

export type BadgeVariant =
  | "purple"
  | "orange"
  | "green"
  | "blue"
  | "red"
  | "neutral"
  | "code"

export type BadgeType = "default" | "shaded"

export type BadgeProps = {
  className?: string
  variant: BadgeVariant
  badgeType?: BadgeType
} & React.HTMLAttributes<HTMLSpanElement>

export const Badge = ({
  className,
  variant,
  badgeType = "default",
  children,
}: BadgeProps) => {
  return (
    <span
      className={clsx(
        "text-compact-x-small-plus text-center",
        badgeType === "default" &&
          "px-docs_0.25 py-0 rounded-docs_sm border border-solid",
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
        badgeType === "shaded" && "px-[3px] !bg-transparent relative",
        // needed for tailwind utilities
        "badge",
        className
      )}
    >
      {badgeType === "shaded" && (
        <ShadedBgIcon
          variant={variant}
          className={clsx("absolute top-0 left-0 w-full h-full")}
        />
      )}
      <span className={clsx(badgeType === "shaded" && "relative z-[1]")}>
        {children}
      </span>
    </span>
  )
}
