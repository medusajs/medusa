"use client"

import React, { useMemo } from "react"
import {
  Button,
  CurrentItemsState,
  useLayout,
  useMainNav,
  useSidebar,
} from "../../.."
import clsx from "clsx"
import Link from "next/link"
import { SidebarItemLink } from "types"

export const MainNavBreadcrumbs = () => {
  const { currentItems, getActiveItem } = useSidebar()
  const { showSidebar } = useLayout()
  const {
    activeItem: mainNavActiveItem,
    breadcrumbOptions: { showCategories },
  } = useMainNav()

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
        : (item.parentItem?.type === "category" && showCategories) ||
          item.parentItem?.type === "sub-category"
        ? "#"
        : undefined
    const firstItemPath =
      item.default[0].type === "link"
        ? getLinkPath(item.default[0])
        : (item.default[0].type === "category" && showCategories) ||
          item.default[0].type === "sub-category"
        ? "#"
        : undefined

    const breadcrumbPath = parentPath || firstItemPath || "/"

    if (!mainNavActiveItem?.path.endsWith(breadcrumbPath)) {
      tempBreadcrumbItems.set(
        breadcrumbPath,
        item.parentItem?.childSidebarTitle || item.parentItem?.title || ""
      )
    }

    return tempBreadcrumbItems
  }

  const breadcrumbItems = useMemo(() => {
    const tempBreadcrumbItems: Map<string, string> = new Map()
    if (!showSidebar) {
      return tempBreadcrumbItems
    }

    if (currentItems) {
      getBreadcrumbsOfItem(currentItems).forEach((value, key) =>
        tempBreadcrumbItems.set(key, value)
      )
    }

    const activeItem = getActiveItem()
    if (activeItem && !mainNavActiveItem?.path.endsWith(activeItem.path)) {
      if (
        activeItem.parentItem &&
        (activeItem.parentItem.type !== "category" || showCategories)
      ) {
        tempBreadcrumbItems.set(
          activeItem.parentItem.type === "link"
            ? getLinkPath(activeItem.parentItem) || "#"
            : "#",
          activeItem.parentItem.title || ""
        )
      }
      tempBreadcrumbItems.set(
        getLinkPath(activeItem) || "/",
        activeItem.title || ""
      )
    }

    return tempBreadcrumbItems
  }, [currentItems, getActiveItem, showSidebar])

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
            className={clsx(
              "px-docs_0.5 py-docs_0.25",
              link === "#" && "hover:!bg-transparent hover:cursor-default"
            )}
          >
            <Link
              href={link}
              className={clsx(link === "#" && "hover:cursor-default")}
            >
              {title}
            </Link>
          </Button>
        </React.Fragment>
      ))}
    </div>
  )
}
