"use client"

import React from "react"
import { NavbarIconButton, NavbarIconButtonProps } from "../../IconButton"
import clsx from "clsx"
import { usePageLoading } from "@/providers"
import { Sidebar, XMark } from "@medusajs/icons"

export type NavbarMobileMenuButtonProps = {
  buttonProps?: NavbarIconButtonProps
  mobileSidebarOpen: boolean
  setMobileSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const NavbarMobileMenuButton = ({
  buttonProps,
  mobileSidebarOpen,
  setMobileSidebarOpen,
}: NavbarMobileMenuButtonProps) => {
  const { isLoading } = usePageLoading()

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
      {!mobileSidebarOpen && <Sidebar className="text-ui-fg-muted" />}
      {mobileSidebarOpen && <XMark className="text-ui-fg-muted" />}
    </NavbarIconButton>
  )
}
