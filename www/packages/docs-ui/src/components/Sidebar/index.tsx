"use client"

import React, { useMemo, useRef } from "react"
import { useSidebar } from "@/providers"
import clsx from "clsx"
import { Loading } from "@/components"
import { SidebarItem } from "./Item"
import { SidebarTitle } from "./Title"
import { SidebarBack } from "./Back"
import { CSSTransition, SwitchTransition } from "react-transition-group"

export type SidebarProps = {
  className?: string
  expandItems?: boolean
  banner?: React.ReactNode
}

export const Sidebar = ({
  className = "",
  expandItems = false,
  banner,
}: SidebarProps) => {
  const {
    items,
    currentItems,
    mobileSidebarOpen,
    desktopSidebarOpen,
    staticSidebarItems,
    sidebarRef,
  } = useSidebar()

  const sidebarItems = useMemo(
    () => currentItems || items,
    [items, currentItems]
  )

  const sidebarHasParent = useMemo(
    () => sidebarItems.parentItem !== undefined,
    [sidebarItems]
  )

  return (
    <aside
      className={clsx(
        "clip bg-docs-bg dark:bg-docs-bg-dark block",
        "border-medusa-border-base border-0 border-r border-solid",
        "fixed -left-full top-0 h-screen transition-[left] lg:relative lg:left-0 lg:top-auto lg:h-auto",
        "lg:w-sidebar w-full",
        mobileSidebarOpen && "!left-0 z-50 top-[57px]",
        !desktopSidebarOpen && "!absolute !-left-full",
        className
      )}
      style={{
        animationFillMode: "forwards",
      }}
    >
      <ul
        className={clsx(
          "sticky top-0 h-screen max-h-screen w-full list-none p-0",
          "px-docs_1.5 pb-[57px] pt-docs_1.5",
          "flex flex-col"
        )}
        id="sidebar"
      >
        {banner && <div className="mb-docs_1">{banner}</div>}
        {sidebarItems.parentItem && (
          <div className={clsx("mb-docs_1", !banner && "mt-docs_1.5")}>
            <SidebarBack />
            <SidebarTitle item={sidebarItems.parentItem} />
          </div>
        )}
        <SwitchTransition>
          <CSSTransition
            key={sidebarItems.parentItem?.title || "home"}
            nodeRef={sidebarRef}
            classNames={{
              enter: "animate-fadeInLeft animate-fast",
              exit: "animate-fadeOutLeft animate-fast",
            }}
            timeout={200}
          >
            <div className="overflow-auto" ref={sidebarRef}>
              <div className={clsx("mb-docs_1.5 lg:hidden")}>
                {!sidebarItems.mobile.length && !staticSidebarItems && (
                  <Loading className="px-0" />
                )}
                {sidebarItems.mobile.map((item, index) => (
                  <SidebarItem
                    item={item}
                    key={index}
                    expandItems={expandItems}
                    sidebarHasParent={sidebarHasParent}
                    isMobile={true}
                  />
                ))}
              </div>
              <div className={clsx("mb-docs_1.5")}>
                {!sidebarItems.top.length && !staticSidebarItems && (
                  <Loading className="px-0" />
                )}
                {sidebarItems.top.map((item, index) => (
                  <SidebarItem
                    item={item}
                    key={index}
                    expandItems={expandItems}
                    sidebarHasParent={sidebarHasParent}
                  />
                ))}
              </div>
              <div className="mb-docs_1.5">
                {!sidebarItems.bottom.length && !staticSidebarItems && (
                  <Loading className="px-0" />
                )}
                {sidebarItems.bottom.map((item, index) => (
                  <SidebarItem
                    item={item}
                    key={index}
                    expandItems={expandItems}
                    sidebarHasParent={sidebarHasParent}
                  />
                ))}
              </div>
            </div>
          </CSSTransition>
        </SwitchTransition>
      </ul>
    </aside>
  )
}
