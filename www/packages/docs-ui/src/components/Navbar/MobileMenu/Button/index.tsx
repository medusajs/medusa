"use client"

import React from "react"
import { NavbarIconButton, NavbarIconButtonProps } from "../../IconButton"
import clsx from "clsx"
import { Sidebar, XMark } from "@medusajs/icons"

export type NavbarMobileMenuButtonProps = {
  buttonProps?: NavbarIconButtonProps
  mobileSidebarOpen: boolean
  setMobileSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
  isLoading?: boolean
}

export const NavbarMobileMenuButton = ({
  buttonProps,
  mobileSidebarOpen,
  setMobileSidebarOpen,
  isLoading = false,
}: NavbarMobileMenuButtonProps) => {
  return (
    <NavbarIconButton
      {...buttonProps}
      className={clsx("mr-docs_1 lg:!hidden", buttonProps?.className)}
      onClick={() => {
        if (!isLoading) {
          setMobileSidebarOpen((prevValue) => !prevValue)
        }
      }}
    >
      {!mobileSidebarOpen && <Sidebar className="text-medusa-fg-muted" />}
      {mobileSidebarOpen && <XMark className="text-medusa-fg-muted" />}
    </NavbarIconButton>
  )
}
