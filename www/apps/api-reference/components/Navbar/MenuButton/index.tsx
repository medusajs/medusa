"use client"

import NavbarIconButton, { NavbarIconButtonProps } from "../IconButton"
import { useSidebar } from "@/providers/sidebar"
import IconSidebar from "../../Icons/Sidebar"
import clsx from "clsx"
import IconXMark from "../../Icons/XMark"
import { usePageLoading } from "../../../providers/page-loading"

type NavbarMenuButtonProps = {
  buttonProps?: NavbarIconButtonProps
}

const NavbarMenuButton = ({ buttonProps }: NavbarMenuButtonProps) => {
  const { setMobileSidebarOpen, mobileSidebarOpen } = useSidebar()
  const { isLoading } = usePageLoading()

  return (
    <NavbarIconButton
      {...buttonProps}
      className={clsx("mr-1 lg:!hidden", buttonProps?.className)}
      onClick={() => {
        if (!isLoading) {
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
