import clsx from "clsx"
import React from "react"

type BadgeProps = {
  variant:
    | "primary"
    | "danger"
    | "success"
    | "warning"
    | "ghost"
    | "default"
    | "disabled"
    | "new-feature"
} & React.HTMLAttributes<HTMLDivElement>

const Badge: React.FC<BadgeProps> = ({
  children,
  variant,
  onClick,
  className,
  ...props
}) => {
  const variantClassname = clsx({
    ["badge-primary"]: variant === "primary",
    ["badge-danger"]: variant === "danger",
    ["badge-success"]: variant === "success",
    ["badge-warning"]: variant === "warning",
    ["badge-ghost"]: variant === "ghost",
    ["badge-default"]: variant === "default",
    ["badge-disabled"]: variant === "disabled",
    ["bg-blue-10 border-blue-30 border font-normal text-blue-50"]:
      variant === "new-feature",
  })

  return (
    <div
      className={clsx("badge", variantClassname, className)}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  )
}

export default Badge
