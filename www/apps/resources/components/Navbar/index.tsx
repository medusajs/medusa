"use client"

import { Navbar as UiNavbar, getNavbarItems } from "docs-ui"
import { useSidebar } from "docs-ui"
import { basePathUrl } from "../../utils/base-path-url"
import { useMemo } from "react"
import { config } from "../../config"

const Navbar = () => {
  const { setMobileSidebarOpen, mobileSidebarOpen } = useSidebar()
  const navbarItems = useMemo(
    () =>
      getNavbarItems({
        basePath: config.baseUrl,
        activePath: basePathUrl(""),
        version: "v2",
      }),
    []
  )

  return (
    <UiNavbar
      logo={{
        light: basePathUrl("/images/logo-icon.png"),
        dark: basePathUrl("/images/logo-icon-dark.png"),
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
