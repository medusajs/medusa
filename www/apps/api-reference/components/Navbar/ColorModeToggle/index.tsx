"use client"

import { IconProps } from "@medusajs/icons/dist/types"
import NavbarIconButton, { NavbarIconButtonProps } from "../IconButton"
import { useColorMode } from "docs-ui"
import dynamic from "next/dynamic"

const IconLightMode = dynamic<IconProps>(
  async () => (await import("@medusajs/icons")).Sun
) as React.FC<IconProps>

const IconDarkMode = dynamic<IconProps>(
  async () => (await import("@medusajs/icons")).Moon
) as React.FC<IconProps>

type NavbarColorModeToggleProps = {
  buttonProps?: NavbarIconButtonProps
}

const NavbarColorModeToggle = ({ buttonProps }: NavbarColorModeToggleProps) => {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <NavbarIconButton {...buttonProps} onClick={() => toggleColorMode()}>
      {colorMode === "light" && <IconLightMode className="text-ui-fg-muted" />}
      {colorMode === "dark" && <IconDarkMode className="text-ui-fg-muted" />}
    </NavbarIconButton>
  )
}

export default NavbarColorModeToggle
