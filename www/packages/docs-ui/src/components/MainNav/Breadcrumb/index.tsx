"use client"

import React, { useMemo } from "react"
import { Button, CurrentItemsState, useSidebar } from "../../.."
import clsx from "clsx"
import Link from "next/link"
import { SidebarItemLink } from "types"

export const MainNavBreadcrumbs = () => {
  const { currentItems, getActiveItem } = useSidebar()

  const getLinkPath = (item?: SidebarItemLink): string | undefined => {
    if (!item) {
      return
    }
    return item.isPathHref ? item.path : `#${item.path}`
  }

  const getBreadcrumbsOfItem = (
    item: CurrentItemsState
  ): Map<string, string> => {
    let tempBreadcrumbItems: Map<string, string> = new Map()
    if (item.previousSidebar) {
      tempBreadcrumbItems = getBreadcrumbsOfItem(item.previousSidebar)
    }

    const parentPath =
      item.parentItem?.type === "link"
        ? getLinkPath(item.parentItem)
        : undefined
    const firstItemPath =
      item.default[0].type === "link" ? getLinkPath(item.default[0]) : undefined

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
      tempBreadcrumbItems.set(
        getLinkPath(activeItem) || "/",
        activeItem?.title || ""
      )
    }

    return tempBreadcrumbItems
  }, [currentItems, getActiveItem])

  return (
    <div
      className={clsx(
        "flex items-center gap-docs_0.25",
        "text-medusa-fg-muted text-compact-small"
      )}
    >
      {Array.from(breadcrumbItems).map(([link, title]) => (
        <React.Fragment key={link}>
          <span>/</span>
          <Button
            variant="transparent-clear"
            className="px-docs_0.5 py-docs_0.25"
          >
            <Link href={link}>{title}</Link>
          </Button>
        </React.Fragment>
      ))}
    </div>
  )
}
