"use client"

import { useColorMode } from "@/providers/color-mode"
import NavbarIconButton from "../IconButton"
import clsx from "clsx"
import type IconProps from "@/components/Icons/types"
import dynamic from "next/dynamic"

const IconLightMode = dynamic<IconProps>(
  async () => import("../../Icons/LightMode")
) as React.FC<IconProps>

const IconDarkMode = dynamic<IconProps>(
  async () => import("../../Icons/DarkMode")
) as React.FC<IconProps>

const NavbarColorModeToggle = () => {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <NavbarIconButton onClick={() => toggleColorMode()}>
      {colorMode === "light" && (
        <IconLightMode iconColorClassName="stroke-medusa-fg-muted dark:stroke-medusa-fg-muted-dark" />
      )}
      {colorMode === "dark" && (
        <IconDarkMode iconColorClassName="stroke-medusa-fg-muted dark:stroke-medusa-fg-muted-dark" />
      )}
    </NavbarIconButton>
  )
}

export default NavbarColorModeToggle
