"use client"

import { Navbar as UiNavbar, getNavbarItems } from "docs-ui"
import { useSidebar } from "docs-ui"
import { useMemo } from "react"
import { config } from "../../config"

const Navbar = () => {
  const { setMobileSidebarOpen, mobileSidebarOpen } = useSidebar()

  const navbarItems = useMemo(
    () =>
      getNavbarItems({
        basePath: config.baseUrl,
        activePath: "/",
      }),
    []
  )

  return (
    <UiNavbar
      logo={{
        light: "/images/logo-icon.png",
        dark: "/images/logo-icon-dark.png",
      }}
      items={navbarItems}
      mobileMenuButton={{
        setMobileSidebarOpen,
        mobileSidebarOpen,
      }}
      isLoading={false}
    />
  )
}

export default Navbar
