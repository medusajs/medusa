"use client"

import { docsConfig } from "@/config/docs"
import { Navbar as UiNavbar } from "docs-ui"
import { useState } from "react"
import { basePathUrl } from "@/lib/base-path-url"

const Navbar = () => {
  const [open, setOpen] = useState(false)

  return (
    <UiNavbar
      logo={{
        light: basePathUrl("/images/logo-icon.png"),
        dark: basePathUrl("/images/logo-icon-dark.png"),
      }}
      items={docsConfig.mainNav}
      mobileMenuButton={{
        setMobileSidebarOpen: setOpen,
        mobileSidebarOpen: open,
      }}
      className="!z-[99]"
    />
  )
}

export { Navbar }
