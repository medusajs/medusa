"use client"

// @refresh reset

import React, { useCallback, useEffect, useMemo, useRef } from "react"
import { Sidebar } from "types"
import { Badge } from "@/components/Badge"
import { checkSidebarItemVisibility } from "@/utils/check-sidebar-item-visibility"
import { useSidebar } from "@/providers/Sidebar"
import { SidebarItem } from "@/components/Sidebar/Item"
import clsx from "clsx"
import Link from "next/link"
import { useMobile } from "@/providers/Mobile"

export type SidebarItemLinkProps = {
  item: Sidebar.SidebarItemLink
  nested?: boolean
  isParentCategoryOpen?: boolean
} & React.AllHTMLAttributes<HTMLLIElement>

export const SidebarItemLink = ({
  item,
  className,
  nested = false,
  isParentCategoryOpen,
}: SidebarItemLinkProps) => {
  const {
    isItemActive,
    setMobileSidebarOpen: setSidebarOpen,
    disableActiveTransition,
    sidebarRef,
    sidebarTopHeight,
  } = useSidebar()
  const { isMobile } = useMobile()
  const active = useMemo(
    () =>
      isItemActive({
        item,
        checkLinkChildren: false,
      }),
    [isItemActive, item]
  )
  const ref = useRef<HTMLLIElement>(null)

  const getNewTopCalculator = useCallback(() => {
    if (!sidebarRef.current || !ref.current) {
      return 0
    }

    const sidebarBoundingRect = sidebarRef.current.getBoundingClientRect()
    const itemBoundingRect = ref.current.getBoundingClientRect()

    return (
      itemBoundingRect.top -
      (sidebarBoundingRect.top + sidebarTopHeight) +
      sidebarRef.current.scrollTop -
      10 // remove extra margin just in case
    )
  }, [sidebarTopHeight, sidebarRef.current, ref.current])

  useEffect(() => {
    if (
      !active ||
      !ref.current ||
      !sidebarRef.current ||
      isMobile ||
      !isParentCategoryOpen
    ) {
      return
    }

    const isVisible = checkSidebarItemVisibility(
      (ref.current.children.item(0) as HTMLElement) || ref.current,
      !disableActiveTransition
    )
    if (isVisible) {
      return
    }
    if (!disableActiveTransition) {
      ref.current.scrollIntoView({
        block: "center",
      })
    } else {
      sidebarRef.current.scrollTo({
        top: getNewTopCalculator(),
      })
    }
  }, [
    active,
    sidebarRef.current,
    disableActiveTransition,
    isMobile,
    ref.current,
    getNewTopCalculator,
    isParentCategoryOpen,
  ])

  useEffect(() => {
    if (active && isMobile) {
      setSidebarOpen(false)
    }
  }, [active, isMobile])

  const hasChildren = useMemo(() => {
    return !item.hideChildren && (item.children?.length || 0) > 0
  }, [item.children])

  const isTitleOneWord = useMemo(
    () => item.title.split(" ").length === 1,
    [item.title]
  )

  return (
    <li ref={ref}>
      <span className="block px-docs_0.75">
        <Link
          href={item.isPathHref ? item.path : `#${item.path}`}
          className={clsx(
            "py-docs_0.25 px-docs_0.5",
            "block w-full rounded-docs_sm",
            !isTitleOneWord && "break-words",
            active && [
              "bg-medusa-bg-base",
              "shadow-elevation-card-rest dark:shadow-elevation-card-rest-dark",
              "text-medusa-fg-base",
            ],
            !active && [
              !nested && "text-medusa-fg-subtle",
              nested && "text-medusa-fg-muted",
              "hover:bg-medusa-bg-base-hover lg:hover:bg-medusa-bg-subtle-hover",
            ],
            "text-compact-small-plus",
            "flex justify-between items-center gap-[6px]",
            className
          )}
          target={item.type === "external" ? "_blank" : undefined}
          rel={item.type === "external" ? "noopener noreferrer" : undefined}
          {...item.linkProps}
        >
          <span
            className={clsx(
              isTitleOneWord && "truncate",
              nested && "inline-block pl-docs_1.5"
            )}
            data-testid="sidebar-item-title"
          >
            {item.title}
          </span>
          {item.additionalElms}
          {item.badge && (
            <Badge variant={item.badge.variant}>{item.badge.text}</Badge>
          )}
        </Link>
      </span>
      {hasChildren && (
        <ul
          className={clsx(
            "ease-ease overflow-hidden",
            "flex flex-col gap-docs_0.125",
            "pt-docs_0.125 pb-docs_0.5"
          )}
        >
          {item.children!.map((childItem, index) => (
            <SidebarItem
              item={childItem}
              key={index}
              nested={!item.childrenSameLevel}
              isParentCategoryOpen={isParentCategoryOpen}
            />
          ))}
        </ul>
      )}
    </li>
  )
}
