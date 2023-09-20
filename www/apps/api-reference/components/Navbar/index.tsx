"use client"

import { Navbar as UiNavbar, usePageLoading } from "docs-ui"
import getLinkWithBasePath from "../../utils/get-link-with-base-path"
import { useSidebar } from "docs-ui"
import FeedbackModal from "./FeedbackModal"

const Navbar = () => {
  const { setMobileSidebarOpen, mobileSidebarOpen } = useSidebar()
  const { isLoading } = usePageLoading()

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
        },
        {
          href: `${getLinkWithBasePath("/admin")}`,
          label: "Admin API",
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
      isLoading={isLoading}
    />
  )
}

export default Navbar
