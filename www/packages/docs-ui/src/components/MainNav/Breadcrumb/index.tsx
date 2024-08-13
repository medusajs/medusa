"use client"

import React, { useMemo } from "react"
import { CurrentItemsState, useSidebar } from "../../.."
import clsx from "clsx"
import Link from "next/link"

export const MainNavBreadcrumbs = () => {
  const { currentItems, getActiveItem } = useSidebar()

  const getBreadcrumbsOfItem = (
    item: CurrentItemsState
  ): Map<string, string> => {
    let tempBreadcrumbItems: Map<string, string> = new Map()
    if (item.previousSidebar) {
      tempBreadcrumbItems = getBreadcrumbsOfItem(item.previousSidebar)
    }

    const parentPath =
      item.parentItem?.type === "link" ? item.parentItem.path : undefined
    const firstItemPath =
      item.default[0].type === "link" ? item.default[0].path : undefined

    tempBreadcrumbItems.set(
      parentPath || firstItemPath || "/",
      item.parentItem?.childSidebarTitle || item.parentItem?.title || ""
    )

    return tempBreadcrumbItems
  }

  const breadcrumbItems = useMemo(() => {
    const tempBreadcrumbItems: Map<string, string> = new Map()
    if (currentItems) {
      getBreadcrumbsOfItem(currentItems).forEach((value, key) =>
        tempBreadcrumbItems.set(key, value)
      )
    }

    const activeItem = getActiveItem()
    if (activeItem) {
      tempBreadcrumbItems.set(activeItem?.path || "/", activeItem?.title || "")
    }

    return tempBreadcrumbItems
  }, [currentItems, getActiveItem])

  return (
    <div
      className={clsx(
        "flex items-center",
        "text-medusa-fg-muted text-compact-small"
      )}
    >
      {Array.from(breadcrumbItems).map(([link, title]) => (
        <React.Fragment key={link}>
          <span>/</span>
          <Link
            href={link}
            className={clsx(
              "hover:text-medusa-fg-base transition-colors",
              "px-docs_0.5 py-docs_0.25"
            )}
          >
            {title}
          </Link>
        </React.Fragment>
      ))}
    </div>
  )
}
