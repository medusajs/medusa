"use client"

// @refresh reset

import React, { useEffect, useMemo, useRef } from "react"
import { SidebarItemLink as SidebarItemlinkType } from "types"
import {
  checkSidebarItemVisibility,
  SidebarItem,
  useMobile,
  useSidebar,
} from "../../../.."
import clsx from "clsx"
import Link from "next/link"

export type SidebarItemLinkProps = {
  item: SidebarItemlinkType
  nested?: boolean
} & React.AllHTMLAttributes<HTMLLIElement>

export const SidebarItemLink = ({
  item,
  className,
  nested = false,
}: SidebarItemLinkProps) => {
  const {
    isItemActive,
    setMobileSidebarOpen: setSidebarOpen,
    disableActiveTransition,
    sidebarRef,
  } = useSidebar()
  const { isMobile } = useMobile()
  const active = useMemo(
    () => !isMobile && isItemActive(item, true),
    [isItemActive, item, isMobile]
  )
  const ref = useRef<HTMLLIElement>(null)

  /**
   * Tries to place the item in the center of the sidebar
   */
  const newTopCalculator = (): number => {
    if (!sidebarRef.current || !ref.current) {
      return 0
    }
    const sidebarBoundingRect = sidebarRef.current.getBoundingClientRect()
    const sidebarHalf = sidebarBoundingRect.height / 2
    const itemTop = ref.current.offsetTop
    const itemBottom =
      itemTop + (ref.current.children.item(0) as HTMLElement)?.clientHeight

    // try deducting half
    let newTop = itemTop - sidebarHalf
    let newBottom = newTop + sidebarBoundingRect.height
    if (newTop <= itemTop && newBottom >= itemBottom) {
      return newTop
    }

    // try adding half
    newTop = itemTop + sidebarHalf
    newBottom = newTop + sidebarBoundingRect.height
    if (newTop <= itemTop && newBottom >= itemBottom) {
      return newTop
    }

    //return the item's top minus some top margin
    return itemTop - sidebarBoundingRect.top
  }

  useEffect(() => {
    if (
      active &&
      ref.current &&
      sidebarRef.current &&
      window.innerWidth >= 1025
    ) {
      if (
        !disableActiveTransition &&
        !checkSidebarItemVisibility(
          (ref.current.children.item(0) as HTMLElement) || ref.current,
          !disableActiveTransition
        )
      ) {
        ref.current.scrollIntoView({
          block: "center",
        })
      } else if (disableActiveTransition) {
        sidebarRef.current.scrollTo({
          top: newTopCalculator(),
        })
      }
    }
  }, [active, sidebarRef.current, disableActiveTransition])

  const hasChildren = useMemo(() => {
    return item.children?.length || 0 > 0
  }, [item.children])

  return (
    <li ref={ref}>
      <Link
        href={item.isPathHref ? item.path : `#${item.path}`}
        className={clsx(
          "py-docs_0.25 px-docs_0.5",
          "block w-full rounded-docs_sm ",
          active && [
            "bg-medusa-bg-base",
            "border border-medusa-border-base",
            "text-medusa-fg-base",
          ],
          !active && [
            !nested && "text-medusa-fg-subtle",
            nested && "text-medusa-fg-muted",
            "hover:bg-medusa-bg-base-hover lg:hover:bg-medusa-bg-subtle-hover",
          ],
          "text-compact-small-plus",
          className
        )}
        scroll={true}
        onClick={() => {
          if (isMobile) {
            setSidebarOpen(false)
          }
        }}
        replace={!item.isPathHref}
        shallow={!item.isPathHref}
        {...item.linkProps}
      >
        <span>{item.title}</span>
        {item.additionalElms}
      </Link>
      {hasChildren && (
        <ul
          className={clsx(
            "ease-ease overflow-hidden",
            "flex flex-col gap-docs_0.125",
            !item.childrenSameLevel && "pl-docs_1.5"
          )}
        >
          {item.children!.map((childItem, index) => (
            <SidebarItem
              item={childItem}
              key={index}
              nested={!item.childrenSameLevel}
            />
          ))}
        </ul>
      )}
    </li>
  )
}
