import React from "react"
import clsx from "clsx"
import { useNavbarSecondaryMenu } from "@docusaurus/theme-common/internal"
import type { Props } from "@theme/Navbar/MobileSidebar/Layout"

export default function NavbarMobileSidebarLayout({
  primaryMenu,
  secondaryMenu,
}: Props): JSX.Element {
  const { shown: secondaryMenuShown } = useNavbarSecondaryMenu()
  return (
    <div className="navbar-sidebar top-[57px] shadow-none">
      <div
        className={clsx("navbar-sidebar__items", {
          "navbar-sidebar__items--show-secondary": secondaryMenuShown,
        })}
      >
        <div className="navbar-sidebar__item menu">{primaryMenu}</div>
        <div className="navbar-sidebar__item menu">{secondaryMenu}</div>
      </div>
    </div>
  )
}
