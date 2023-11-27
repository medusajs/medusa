import React from "react"
import type { BorderedIconProps as UiBorderedIconProps } from "docs-ui"
import { BorderedIcon as UiBorderedIcon } from "docs-ui"
import { useColorMode } from "@docusaurus/theme-common"

type BorderedIconProps = {
  icon?: {
    light: string
    dark?: string
  }
} & Omit<UiBorderedIconProps, "icon">

const BorderedIcon: React.FC<BorderedIconProps> = ({
  icon = null,
  ...props
}) => {
  const { colorMode } = useColorMode()

  return (
    <UiBorderedIcon
      {...props}
      icon={
        icon
          ? colorMode === "light"
            ? icon.light
            : icon.dark || icon.light
          : ""
      }
    />
  )
}

export default BorderedIcon
