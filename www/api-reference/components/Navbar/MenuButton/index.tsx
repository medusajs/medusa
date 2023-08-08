"use client"

import IconBarsThree from "@/components/Icons/BarsThree"
import NavbarIconButton from "../IconButton"
import { useSidebar } from "@/providers/sidebar"

const NavbarMenuButton = () => {
  const {
    items,
    mobileSidebarOpen: sidebarOpen,
    setMobileSidebarOpen: setSidebarOpen,
  } = useSidebar()

  return (
    <NavbarIconButton
      className="mr-1 lg:hidden"
      onClick={() => {
        if (items.top.length !== 0 || items.bottom.length !== 0) {
          setSidebarOpen(!sidebarOpen)
        }
      }}
    >
      <IconBarsThree />
    </NavbarIconButton>
  )
}

export default NavbarMenuButton
