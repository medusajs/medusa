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
        "outline-grey-20 flex aspect-square h-[40px] w-[40px] items-center justify-center border-2 border-white outline outline-1",
        className
      )}
      {...rest}
    >
      {children}
    </Badge>
  )
}

export default IconBadge
