import React from "react"
import ThemedImage from "@theme/ThemedImage"
import clsx from "clsx"
import styles from "./styles.module.css"
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
} & React.HTMLAttributes<HTMLSpanElement>

const BorderedIcon: React.FC<BorderedIconProp> = ({
  icon = null,
  IconComponent = null,
  wrapperClassName,
  iconWrapperClassName,
  iconClassName,
}) => {
  return (
    <Bordered wrapperClassName={wrapperClassName}>
      <span className={clsx(styles.borderedIconWrapper, iconWrapperClassName)}>
        {!IconComponent && (
          <ThemedImage
            sources={{
              light: icon.light,
              dark: icon.dark || icon.light,
            }}
            className={clsx(styles.icon, iconClassName, "bordered-icon")}
          />
        )}
        {IconComponent && (
          <IconComponent
            className={clsx(styles.icon, iconClassName, "bordered-icon")}
          />
        )}
      </span>
    </Bordered>
  )
}

export default BorderedIcon
