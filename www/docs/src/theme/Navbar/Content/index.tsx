import React, { type ReactNode } from "react"
import { useThemeConfig } from "@docusaurus/theme-common"
import {
  splitNavbarItems,
  useNavbarMobileSidebar,
} from "@docusaurus/theme-common/internal"
import NavbarItem, { type Props as NavbarItemConfig } from "@theme/NavbarItem"
import NavbarColorModeToggle from "@theme/Navbar/ColorModeToggle"
import NavbarMobileSidebarToggle from "@theme/Navbar/MobileSidebar/Toggle"
import NavbarLogo from "@theme/Navbar/Logo"
import styles from "./styles.module.css"
import NavbarActions from "@site/src/components/Navbar/Actions"
import Tooltip from "@site/src/components/Tooltip"
import { ThemeConfig } from "@medusajs/docs"

function useNavbarItems() {
  // TODO temporary casting until ThemeConfig type is improved
  return useThemeConfig().navbar.items as NavbarItemConfig[]
}

function NavbarItems({ items }: { items: NavbarItemConfig[] }): JSX.Element {
  return (
    <>
      {items.map((item, i) => (
        <NavbarItem {...item} key={i} />
      ))}
    </>
  )
}

function NavbarContentLayout({
  left,
  right,
}: {
  left: ReactNode
  right: ReactNode
}) {
  return (
    <div className="navbar__inner">
      <div className="navbar__items">{left}</div>
      <div className="navbar__items navbar__items--right">{right}</div>
    </div>
  )
}

export default function NavbarContent(): JSX.Element {
  const mobileSidebar = useNavbarMobileSidebar()

  const items = useNavbarItems()
  const [leftItems, rightItems] = splitNavbarItems(items)
  const { navbarActions } = useThemeConfig() as ThemeConfig

  return (
    <NavbarContentLayout
      left={
        // TODO stop hardcoding items?
        <>
          {!mobileSidebar.disabled && <NavbarMobileSidebarToggle />}
          <NavbarLogo />
          <NavbarItems items={leftItems} />
        </>
      }
      right={
        // TODO stop hardcoding items?
        // Ask the user to add the respective navbar items => more flexible
        <>
          <NavbarItems items={rightItems} />
          <span className="divider"></span>
          <Tooltip text="Switch theme">
            <NavbarColorModeToggle className={styles.colorModeToggle} />
          </Tooltip>
          <NavbarActions items={navbarActions} />
        </>
      }
    />
  )
}
