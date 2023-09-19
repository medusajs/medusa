"use client"

import { Navbar as UiNavbar } from "docs-ui"
import getLinkWithBasePath from "../../utils/get-link-with-base-path"
import { useSidebar } from "../../providers/sidebar"
import FeedbackModal from "./FeedbackModal"

const Navbar = () => {
  const { setMobileSidebarOpen, mobileSidebarOpen } = useSidebar()

  return (
    <UiNavbar
      logo={{
        light: "/images/logo-icon.png",
        dark: "/images/logo-icon-dark.png",
      }}
      items={[
        {
          href: `/`,
          label: "Docs",
        },
        {
          href: `/user-guide`,
          label: "User Guide",
        },
        {
          href: `${getLinkWithBasePath("/store")}`,
          label: "Store API",
          activeValue: "store",
        },
        {
          href: `${getLinkWithBasePath("/admin")}`,
          label: "Admin API",
          activeValue: "admin",
        },
        {
          href: `/ui`,
          label: "UI",
        },
      ]}
      mobileMenuButton={{
        setMobileSidebarOpen,
        mobileSidebarOpen,
      }}
      additionalActions={<FeedbackModal />}
    />
  )
}

export default Navbar
