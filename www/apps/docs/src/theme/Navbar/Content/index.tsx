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
import clsx from "clsx"
import { ThemeConfig } from "@medusajs/docs"
import { useSidebar } from "../../../providers/Sidebar"
import useIsBrowser from "@docusaurus/useIsBrowser"
import { Tooltip } from "docs-ui"
import NavbarActions from "../../../components/Navbar/Actions"
import { ChevronDoubleLeftMiniSolid, Sidebar } from "@medusajs/icons"

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
        "flex flex-wrap justify-between items-center w-full",
        "lg:max-w-xl mx-auto py-0.5 px-1"
      )}
    >
      <div className={clsx("items-center flex flex-1 min-w-0 gap-1.5")}>
        {left}
      </div>
      <div
        className={clsx("items-center flex lg:flex-1 min-w-0", "justify-end")}
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
          <NavbarItems items={leftItems} />
        </>
      }
      right={
        // TODO stop hardcoding items?
        // Ask the user to add the respective navbar items => more flexible
        <div className="flex gap-0.5">
          <NavbarItems items={rightItems} />
          {hideable && sidebarContext?.hasSidebar && (
            <NavbarActions
              items={[
                {
                  type: "button",
                  html: !sidebarContext?.hiddenSidebarContainer
                    ? `<span class="text-compact-x-small-plus">Close sidebar <kbd class="${clsx(
                        "bg-medusa-tag-neutral-bg",
                        "border border-solid rounded border-medusa-tag-neutral-border",
                        "text-medusa-fg-subtle font-base text-compact-x-small-plus",
                        "inline-flex w-[22px] h-[22px] !p-0 justify-center items-center shadow-none ml-0.5"
                      )}">${isApple ? "⌘" : "Ctrl"}</kbd>
                      <kbd class="${clsx(
                        "bg-medusa-tag-neutral-bg",
                        "border border-solid rounded border-medusa-tag-neutral-border",
                        "text-medusa-fg-subtle font-base text-compact-x-small-plus",
                        "inline-flex w-[22px] h-[22px] !p-0 justify-center items-center shadow-none"
                      )}">I</kbd></span>`
                    : `<span class="text-compact-x-small-plus">Lock sidebar open <kbd class="${clsx(
                        "bg-medusa-tag-neutral-bg",
                        "border border-solid rounded border-medusa-tag-neutral-border",
                        "text-medusa-fg-subtle font-base text-compact-x-small-plus",
                        "inline-flex w-[22px] h-[22px] !p-0 justify-center items-center shadow-none ml-0.5"
                      )}">${isApple ? "⌘" : "Ctrl"}</kbd>
                    <kbd class="${clsx(
                      "bg-medusa-tag-neutral-bg",
                      "border border-solid rounded border-medusa-tag-neutral-border",
                      "text-medusa-fg-subtle font-base text-compact-x-small-plus",
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
                  Icon: !sidebarContext?.hiddenSidebarContainer ? (
                    <Sidebar className="text-medusa-fg-muted" />
                  ) : (
                    <ChevronDoubleLeftMiniSolid className="text-medusa-fg-muted" />
                  ),
                  buttonType: "icon",
                },
              ]}
              className="sidebar-toggler"
            />
          )}
          <Tooltip text="Switch theme">
            <NavbarColorModeToggle
              className={clsx(
                "navbar-action-icon-item !w-2 !h-2 [&>button]:!rounded"
              )}
            />
          </Tooltip>
          <NavbarActions items={navbarActions} />
        </div>
      }
    />
  )
}
