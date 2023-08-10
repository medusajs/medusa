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
import useIsBrowser from "@docusaurus/useIsBrowser"
import clsx from "clsx"
import { useSidebar } from "@site/src/providers/Sidebar"

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
        "flex flex-wrap justify-between w-full",
        "max-w-xl mx-auto py-[12px] px-1.5"
      )}
    >
      <div className={clsx("items-center flex flex-1 min-w-0")}>
        {left}
      </div>
      <div
        className={clsx(
          "items-center flex flex-1 min-w-0",
          "justify-end"
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
  const {
    navbarActions,
    docs: {
      sidebar: { hideable },
    },
  } = useThemeConfig() as ThemeConfig
  const sidebarContext = useSidebar()
  const isBrowser = useIsBrowser()

  const isApple = isBrowser
    ? navigator.userAgent.toLowerCase().indexOf("mac") !== 0
    : true

  return (
    <NavbarContentLayout
      left={
        // TODO stop hardcoding items?
        <>
          {!mobileSidebar.disabled && <NavbarMobileSidebarToggle />}
          <NavbarLogo />
          {hideable && sidebarContext?.hasSidebar && (
            <NavbarActions
              items={[
                {
                  type: "button",
                  html: !sidebarContext?.hiddenSidebarContainer
                    ? `<span class="text-label-x-small-plus">Close sidebar <kbd class="${clsx(
                        "bg-medusa-tag-neutral-bg dark:bg-medusa-tag-neutral-bg-dark",
                        "border border-solid rounded border-medusa-tag-neutral-border dark:border-medusa-tag-neutral-border-dark",
                        "text-medusa-tag-neutral-text dark:text-medusa-tag-neutral-text font-base text-label-x-small-plus",
                        "inline-flex w-[22px] h-[22px] !p-0 justify-center items-center shadow-none ml-0.5"
                      )}">${isApple ? "⌘" : "Ctrl"}</kbd>
                      <kbd class="${clsx(
                        "bg-medusa-tag-neutral-bg dark:bg-medusa-tag-neutral-bg-dark",
                        "border border-solid rounded border-medusa-tag-neutral-border dark:border-medusa-tag-neutral-border-dark",
                        "text-medusa-tag-neutral-text dark:text-medusa-tag-neutral-text font-base text-label-x-small-plus",
                        "inline-flex w-[22px] h-[22px] !p-0 justify-center items-center shadow-none"
                      )}">I</kbd></span>`
                    : `<span class="text-label-x-small-plus">Lock sidebar open <kbd class="${clsx(
                        "bg-medusa-tag-neutral-bg dark:bg-medusa-tag-neutral-bg-dark",
                        "border border-solid rounded border-medusa-tag-neutral-border dark:border-medusa-tag-neutral-border-dark",
                        "text-medusa-tag-neutral-text dark:text-medusa-tag-neutral-text font-base text-label-x-small-plus",
                        "inline-flex w-[22px] h-[22px] !p-0 justify-center items-center shadow-none ml-0.5"
                      )}">${isApple ? "⌘" : "Ctrl"}</kbd>
                    <kbd class="${clsx(
                      "bg-medusa-tag-neutral-bg dark:bg-medusa-tag-neutral-bg-dark",
                      "border border-solid rounded border-medusa-tag-neutral-border dark:border-medusa-tag-neutral-border-dark",
                      "text-medusa-tag-neutral-text dark:text-medusa-tag-neutral-text font-base text-label-x-small-plus",
                      "inline-flex w-[22px] h-[22px] !p-0 justify-center items-center shadow-none"
                    )}">I</kbd></span>`,
                  events: {
                    onClick: sidebarContext?.onCollapse,
                    onMouseEnter: () => {
                      if (!sidebarContext?.hiddenSidebarContainer) {
                        sidebarContext?.setFloatingSidebar(false)
                      } else {
                        sidebarContext?.setFloatingSidebar(true)
                      }
                    },
                    onMouseLeave: () => {
                      setTimeout(() => {
                        if (
                          !document.querySelector(
                            ".theme-doc-sidebar-container:hover"
                          )
                        ) {
                          sidebarContext?.setFloatingSidebar(false)
                        }
                      }, 100)
                    },
                  },
                  icon: !sidebarContext?.hiddenSidebarContainer
                    ? "bars-three"
                    : "chevron-double-left-mini-solid",
                },
              ]}
              className="mr-0.5 sidebar-toggler"
            />
          )}
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
              "lg:h-[20px] lg:w-[1px] lg:mx-1 lg:inline-block lg:align-middle lg:bg-medusa-border-strong lg:dark:bg-medusa-border-strong-dark"
            )}
          ></span>
          <Tooltip text="Switch theme">
            <NavbarColorModeToggle
              className={clsx(
                "lg:block hidden",
                "navbar-action-icon-item !w-2 !h-2 ml-1 mr-[12px] [&>button]:!rounded"
              )}
            />
          </Tooltip>
          <NavbarActions items={navbarActions} />
        </>
      }
    />
  )
}
