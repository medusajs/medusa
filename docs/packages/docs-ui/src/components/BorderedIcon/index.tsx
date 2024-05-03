import React from "react"
import { Bordered } from "@/components/Bordered"
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
  wrapperClassName,
  iconWrapperClassName,
  iconClassName,
  iconColorClassName = "",
}: BorderedIconProps) => {
  return (
    <Bordered wrapperClassName={wrapperClassName}>
      <span
        className={clsx(
          "rounded-docs_xs p-docs_0.125 bg-medusa-bg-component inline-flex items-center justify-center",
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
              "text-medusa-fg-subtle",
              iconClassName,
              "bordered-icon",
              iconColorClassName
            )}
          />
        )}
      </span>
    </Bordered>
  )
}
