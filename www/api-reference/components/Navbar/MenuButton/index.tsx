"use client"

import IconBarsThree from "@/components/Icons/BarsThree"
import NavbarIconButton from "../IconButton"
import { useSidebar } from "@/providers/sidebar"

const NavbarMenuButton = () => {
  const { sidebarOpen, setSidebarOpen } = useSidebar()

  return (
    <NavbarIconButton
      className="mr-1 lg:hidden"
      onClick={() => setSidebarOpen(!sidebarOpen)}
    >
      <IconBarsThree />
    </NavbarIconButton>
  )
}

export default NavbarMenuButton
