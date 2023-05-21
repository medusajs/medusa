import React from "react"
import ThemedImage from "@theme/ThemedImage"
import clsx from "clsx"
import Bordered from "../Bordered/index"
import { IconProps } from "@site/src/theme/Icon/index"

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
  return (
    <Bordered wrapperClassName={wrapperClassName}>
      <span
        className={clsx(
          "tw-inline-flex tw-justify-center tw-items-center tw-rounded-sm tw-p-[2px] tw-bg-medusa-bg-component dark:tw-bg-medusa-bg-component-dark",
          iconWrapperClassName
        )}
      >
        {!IconComponent && (
          <ThemedImage
            sources={{
              light: icon.light,
              dark: icon.dark || icon.light,
            }}
            className={clsx(iconClassName, "bordered-icon")}
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
