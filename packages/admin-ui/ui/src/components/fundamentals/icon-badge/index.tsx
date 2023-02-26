import clsx from "clsx"
import React from "react"
import Badge from "../badge"

type IconBadgeProps = {
  variant?:
    | "primary"
    | "danger"
    | "success"
    | "warning"
    | "ghost"
    | "default"
    | "disabled"
} & React.HTMLAttributes<HTMLDivElement>

const IconBadge: React.FC<IconBadgeProps> = ({
  children,
  variant,
  className,
  ...rest
}) => {
  return (
    <Badge
      variant={variant ?? "default"}
      className={clsx(
        "flex items-center justify-center aspect-square w-[40px] h-[40px] border-2 border-white outline outline-1 outline-grey-20",
        className
      )}
      {...rest}
    >
      {children}
    </Badge>
  )
}

export default IconBadge
