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
    <NavbarIconButton
      className={clsx("ml-1 mr-[12px]")}
      onClick={() => toggleColorMode()}
    >
      {colorMode === "light" && <IconLightMode />}
      {colorMode === "dark" && <IconDarkMode />}
    </NavbarIconButton>
  )
}

export default NavbarColorModeToggle
