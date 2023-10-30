import React from "react"
import { useColorMode, useThemeConfig } from "@docusaurus/theme-common"
import ColorModeToggle from "@theme/ColorModeToggle"
import type { Props } from "@theme/Navbar/ColorModeToggle"
import clsx from "clsx"

export default function NavbarColorModeToggle({
  className,
}: Props): JSX.Element | null {
  const disabled = useThemeConfig().colorMode.disableSwitch
  const { colorMode, setColorMode } = useColorMode()

  if (disabled) {
    return null
  }

  return (
    <ColorModeToggle
      className={clsx("text-ui-fg-muted", className)}
      buttonClassName={clsx("hover:!bg-medusa-button-neutral-hover")}
      value={colorMode}
      onChange={setColorMode}
    />
  )
}
