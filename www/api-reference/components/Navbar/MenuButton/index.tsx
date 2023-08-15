"use client"

import NavbarIconButton, { NavbarIconButtonProps } from "../IconButton"
import { useSidebar } from "@/providers/sidebar"
import IconSidebar from "../../Icons/Sidebar"
import clsx from "clsx"
import IconXMark from "../../Icons/XMark"

type NavbarMenuButtonProps = {
  buttonProps?: NavbarIconButtonProps
}

const NavbarMenuButton = ({ buttonProps }: NavbarMenuButtonProps) => {
  const { items, setMobileSidebarOpen, mobileSidebarOpen } = useSidebar()

  return (
    <NavbarIconButton
      {...buttonProps}
      className={clsx("mr-1 lg:!hidden", buttonProps?.className)}
      onClick={() => {
        if (items.top.length !== 0 && items.bottom.length !== 0) {
          setMobileSidebarOpen((prevValue) => !prevValue)
        }
      }}
    >
      {!mobileSidebarOpen && (
        <IconSidebar iconColorClassName="stroke-medusa-fg-muted dark:stroke-medusa-fg-muted-dark" />
      )}
      {mobileSidebarOpen && (
        <IconXMark iconColorClassName="stroke-medusa-fg-muted dark:stroke-medusa-fg-muted-dark" />
      )}
    </NavbarIconButton>
  )
}

export default NavbarMenuButton
