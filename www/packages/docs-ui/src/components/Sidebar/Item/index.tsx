"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import type { SidebarItemType } from "@/providers"
import { useSidebar } from "@/providers"
import clsx from "clsx"
import Link from "next/link"
import { checkSidebarItemVisibility } from "@/utils"
import { Loading } from "@/components"

export type SidebarItemProps = {
  item: SidebarItemType
  nested?: boolean
  expandItems?: boolean
} & React.AllHTMLAttributes<HTMLLIElement>

export const SidebarItem = ({
  item,
  nested = false,
  expandItems = false,
  className,
}: SidebarItemProps) => {
  const [showLoading, setShowLoading] = useState(false)
  const { isItemActive, setMobileSidebarOpen: setSidebarOpen } = useSidebar()
  const active = useMemo(
    () => isItemActive(item, nested),
    [isItemActive, item, nested]
  )
  const collapsed = !expandItems && !isItemActive(item, true)
  const ref = useRef<HTMLLIElement>(null)

  useEffect(() => {
    if (active && ref.current && window.innerWidth >= 1025) {
      if (
        !checkSidebarItemVisibility(ref.current, {
          topMargin: 57,
        })
      ) {
        // scroll to element
        ref.current.scrollIntoView({
          block: "center",
        })
      }
    }
    if (active) {
      setShowLoading(true)
    }
  }, [active])

  const classNames = useMemo(
    () =>
      clsx(
        "flex items-center justify-between gap-docs_0.5 rounded-docs_sm px-docs_0.5 py-[6px] hover:no-underline",
        !item.children && "text-compact-small-plus text-medusa-fg-subtle",
        item.children &&
          "text-compact-x-small-plus text-medusa-fg-muted uppercase",
        item.path !== undefined &&
          active && ["!text-medusa-fg-base bg-medusa-bg-base-pressed"],
        item.path !== undefined && active && "border border-medusa-border-base",
        item.path !== undefined &&
          !active &&
          "hover:bg-medusa-bg-base-hover border-transparent"
      ),
    [item.children, active, item.path]
  )

  return (
    <li
      className={clsx(
        item.children && !collapsed && "my-docs_1.5",
        !item.children && !nested && active && "mt-docs_1.5",
        !expandItems &&
          ((item.children && !collapsed) ||
            (!item.children && !nested && active)) &&
          "-translate-y-docs_1 transition-transform",
        className
      )}
      ref={ref}
    >
      {item.path === undefined && (
        <span className={classNames}>
          <span>{item.title}</span>
          {item.additionalElms}
        </span>
      )}
      {item.path !== undefined && (
        <Link
          href={item.isPathHref ? item.path : `#${item.path}`}
          className={classNames}
          scroll={true}
          onClick={() => {
            if (window.innerWidth < 1025) {
              setSidebarOpen(false)
            }
          }}
          replace
          shallow
          {...item.linkProps}
        >
          <span>{item.title}</span>
          {item.additionalElms}
        </Link>
      )}
      {item.children && (
        <ul
          className={clsx("ease-ease overflow-hidden", collapsed && "m-0 h-0")}
        >
          {showLoading && !item.loaded && (
            <Loading
              count={3}
              className="!mb-0 !px-docs_0.5"
              barClassName="h-[20px]"
            />
          )}
          {item.children?.map((childItem, index) => (
            <SidebarItem item={childItem} key={index} nested={true} />
          ))}
        </ul>
      )}
    </li>
  )
}
