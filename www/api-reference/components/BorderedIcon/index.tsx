import React from "react"
import clsx from "clsx"
import Bordered from "../Bordered/index"
import IconProps from "../Icons/types"
import { useColorMode } from "../../providers/color-mode"
import Image from "next/image"

type BorderedIconProp = {
  icon?: {
    light: string
    dark?: string
  }
  IconComponent?: React.FC<IconProps>
  wrapperClassName?: string
  iconWrapperClassName?: string
  iconClassName?: string
  iconColorClassName?: string
} & React.HTMLAttributes<HTMLSpanElement>

const BorderedIcon: React.FC<BorderedIconProp> = ({
  icon = null,
  IconComponent = null,
  wrapperClassName,
  iconWrapperClassName,
  iconClassName,
  iconColorClassName = "",
}) => {
  const { colorMode } = useColorMode()

  return (
    <Bordered wrapperClassName={wrapperClassName}>
      <span
        className={clsx(
          "rounded-xs p-0.125 bg-medusa-bg-component dark:bg-medusa-bg-component-dark inline-flex items-center justify-center",
          iconWrapperClassName
        )}
      >
        {!IconComponent && (
          <Image
            src={(colorMode === "light" ? icon?.light : icon?.dark) || ""}
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

export default BorderedIcon
