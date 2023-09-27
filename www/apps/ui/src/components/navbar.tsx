"use client"

import { docsConfig } from "@/config/docs"
import { basePathUrl } from "@/lib/base-path-url"
import { Navbar as UiNavbar, useSidebar } from "docs-ui"

const Navbar = () => {
  const { mobileSidebarOpen, setMobileSidebarOpen } = useSidebar()

  return (
    <UiNavbar
      logo={{
        light: basePathUrl("/images/logo-icon.png"),
        dark: basePathUrl("/images/logo-icon-dark.png"),
      }}
      items={docsConfig.mainNav}
      mobileMenuButton={{
        setMobileSidebarOpen,
        mobileSidebarOpen,
      }}
    />
  )
}

export { Navbar }
