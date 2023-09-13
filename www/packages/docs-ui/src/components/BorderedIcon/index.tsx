import React from "react"
import { IconProps } from "@/icons"
import { Bordered } from "@/components/Bordered"
import clsx from "clsx"

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
  wrapperClassName,
  iconWrapperClassName,
  iconClassName,
  iconColorClassName = "",
}: BorderedIconProps) => {
  return (
    <Bordered wrapperClassName={wrapperClassName}>
      <span
        className={clsx(
          "rounded-xs p-0.125 bg-medusa-bg-component dark:bg-medusa-bg-component-dark inline-flex items-center justify-center",
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
            className={clsx(iconClassName, "bordered-icon")}
            iconColorClassName={iconColorClassName}
          />
        )}
      </span>
    </Bordered>
  )
}
