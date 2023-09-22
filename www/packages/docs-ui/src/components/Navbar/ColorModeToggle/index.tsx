"use client"

import React from "react"
import { NavbarIconButton, NavbarIconButtonProps } from "../IconButton"
import { useColorMode } from "@/providers"
import { Moon, Sun } from "@medusajs/icons"

export type NavbarColorModeToggleProps = {
  buttonProps?: NavbarIconButtonProps
}

export const NavbarColorModeToggle = ({
  buttonProps,
}: NavbarColorModeToggleProps) => {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <NavbarIconButton {...buttonProps} onClick={() => toggleColorMode()}>
      {colorMode === "light" && (
        <Sun className="text-medusa-fg-muted dark:text-medusa-fg-muted-dark" />
      )}
      {colorMode === "dark" && (
        <Moon className="text-medusa-fg-muted dark:text-medusa-fg-muted-dark" />
      )}
    </NavbarIconButton>
  )
}
