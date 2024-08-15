import React from "react"
import clsx from "clsx"
import { IconProps } from "@medusajs/icons/dist/types"

export type BorderedIconProps = {
  icon?: string
  IconComponent?: React.FC<IconProps> | null
  wrapperClassName?: string
  iconWrapperClassName?: string
  iconClassName?: string
  iconColorClassName?: string
} & React.HTMLAttributes<HTMLSpanElement>

export const BorderedIcon = ({
  icon = "",
  IconComponent = null,
  iconWrapperClassName,
  iconClassName,
  iconColorClassName = "",
}: BorderedIconProps) => {
  return (
    <span
      className={clsx(
        "rounded-docs_sm p-docs_0.125 bg-medusa-bg-base inline-flex items-center justify-center",
        "shadow-border-base dark:shadow-border-base-dark",
        iconWrapperClassName
      )}
    >
      {!IconComponent && (
        <img
          src={icon || ""}
          className={clsx(iconClassName, "bordered-icon")}
          alt=""
        />
      )}
      {IconComponent && (
        <IconComponent
          className={clsx(
            "text-medusa-fg-subtle rounded-docs_sm",
            iconClassName,
            "bordered-icon",
            iconColorClassName
          )}
        />
      )}
    </span>
  )
}
