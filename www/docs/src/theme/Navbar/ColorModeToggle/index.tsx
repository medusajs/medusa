import React from "react"
import { useColorMode, useThemeConfig } from "@docusaurus/theme-common"
import ColorModeToggle from "@theme/ColorModeToggle"
import type { Props } from "@theme/Navbar/ColorModeToggle"

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
      className={className}
      buttonClassName={
        "hover:!tw-bg-medusa-button-neutral-hover dark:hover:!tw-bg-medusa-button-neutral-hover-dark"
      }
      value={colorMode}
      onChange={setColorMode}
    />
  )
}
