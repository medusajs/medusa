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
import NavbarActions from "@site/src/components/Navbar/Actions"
import Tooltip from "@site/src/components/Tooltip"
import { ThemeConfig } from "@medusajs/docs"
import clsx from "clsx"

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
    <div
      className={clsx(
        "tw-flex tw-flex-wrap tw-justify-between tw-w-full",
        "tw-max-w-xl tw-mx-auto tw-py-[12px] tw-px-1.5"
      )}
    >
      <div className={clsx("tw-items-center tw-flex tw-flex-1 tw-min-w-0")}>
        {left}
      </div>
      <div
        className={clsx(
          "tw-items-center tw-flex tw-flex-1 tw-min-w-0",
          "tw-justify-end"
        )}
      >
        {right}
      </div>
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
          <span
            className={clsx(
              "lg:tw-h-[20px] lg:tw-w-[1px] lg:tw-mx-1 lg:tw-inline-block lg:tw-align-middle lg:tw-bg-medusa-border-strong lg:dark:tw-bg-medusa-border-strong-dark"
            )}
          ></span>
          <Tooltip text="Switch theme">
            <NavbarColorModeToggle
              className={clsx(
                "lg:tw-block tw-hidden",
                "tw-bg-medusa-button-secondary dark:tw-bg-medusa-button-secondary-dark",
                "tw-border tw-border-solid tw-border-medusa-border-base dark:tw-border-medusa-border-base-dark",
                "tw-rounded !tw-w-2 !tw-h-2 tw-ml-1 tw-mr-[12px] [&>button]:!tw-rounded"
              )}
            />
          </Tooltip>
          <NavbarActions items={navbarActions} />
        </>
      }
    />
  )
}
