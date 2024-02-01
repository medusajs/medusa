import React from "react"
import clsx from "clsx"
import { useThemeConfig } from "@docusaurus/theme-common"
import {
  useHideableNavbar,
  useNavbarMobileSidebar,
} from "@docusaurus/theme-common/internal"
import { translate } from "@docusaurus/Translate"
import NavbarMobileSidebar from "@theme/Navbar/MobileSidebar"
import type { Props } from "@theme/Navbar/Layout"

export default function NavbarLayout({ children }: Props): JSX.Element {
  const {
    navbar: { hideOnScroll, style },
  } = useThemeConfig()
  const mobileSidebar = useNavbarMobileSidebar()
  const { navbarRef, isNavbarVisible } = useHideableNavbar(hideOnScroll)
  return (
    <nav
      ref={navbarRef}
      aria-label={translate({
        id: "theme.NavBar.navAriaLabel",
        message: "Main",
        description: "The ARIA label for the main navigation",
      })}
      className={clsx(
        "navbar",
        "navbar--fixed-top",
        hideOnScroll && [
          "transition-transform",
          !isNavbarVisible && "translate-x-0 translate-y-[calc(-100%-2px)]",
        ],
        {
          "navbar--dark": style === "dark",
          "navbar--primary": style === "primary",
          "navbar-sidebar--show": mobileSidebar.shown,
        }
      )}
    >
      {children}
      <NavbarMobileSidebar />
    </nav>
  )
}
