import React, { FC, HTMLAttributes } from "react"
import clsx from "clsx"

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant:
    | "primary"
    | "danger"
    | "success"
    | "warning"
    | "ghost"
    | "default"
    | "disabled"
  size?: "small" | "medium" | "large"
}

const Badge: FC<BadgeProps> = ({
  children,
  variant,
  size,
  onClick,
  className,
  ...props
}) => {
  const variantClassName = clsx({
    ["badge-primary"]: variant === "primary",
    ["badge-danger"]: variant === "danger",
    ["badge-success"]: variant === "success",
    ["badge-warning"]: variant === "warning",
    ["badge-ghost"]: variant === "ghost",
    ["badge-default"]: variant === "default",
    ["badge-disabled"]: variant === "disabled",
  })

  const sizeClassName = clsx({
    ["badge-large"]: size === "large",
    ["badge-medium"]: size === "medium",
    ["badge-small"]: size === "small",
  })

  return (
    <div
      className={clsx(
        "badge inline-block",
        variantClassName,
        sizeClassName,
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  )
}

export default Badge
