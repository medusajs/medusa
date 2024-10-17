"use client"

import React, { useMemo } from "react"
import clsx from "clsx"
import Link from "next/link"
import { SidebarItemLink } from "types"
import { CurrentItemsState, useSidebar, useSiteConfig } from "../../providers"
import { Button } from "../Button"
import { TriangleRightMini } from "@medusajs/icons"

export const Breadcrumbs = () => {
  const { currentItems, activeItem: sidebarActiveItem } = useSidebar()
  const {
    config: { breadcrumbOptions, project, baseUrl, basePath },
  } = useSiteConfig()

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
        : (item.parentItem?.type === "category" &&
            breadcrumbOptions?.showCategories) ||
          item.parentItem?.type === "sub-category"
        ? "#"
        : undefined
    const firstItemPath =
      item.default[0].type === "link"
        ? getLinkPath(item.default[0])
        : (item.default[0].type === "category" &&
            breadcrumbOptions?.showCategories) ||
          item.default[0].type === "sub-category"
        ? "#"
        : undefined

    const breadcrumbPath = parentPath || firstItemPath || "/"

    tempBreadcrumbItems.set(
      breadcrumbPath,
      item.parentItem?.childSidebarTitle || item.parentItem?.title || ""
    )

    return tempBreadcrumbItems
  }

  const breadcrumbItems = useMemo(() => {
    const tempBreadcrumbItems: Map<string, string> = new Map()
    tempBreadcrumbItems.set(`${baseUrl}${basePath}`, project.title)

    if (currentItems) {
      getBreadcrumbsOfItem(currentItems).forEach((value, key) =>
        tempBreadcrumbItems.set(key, value)
      )
    }

    if (sidebarActiveItem) {
      if (
        sidebarActiveItem.parentItem &&
        (sidebarActiveItem.parentItem.type !== "category" ||
          breadcrumbOptions?.showCategories)
      ) {
        tempBreadcrumbItems.set(
          sidebarActiveItem.parentItem.type === "link"
            ? getLinkPath(sidebarActiveItem.parentItem) || "#"
            : "#",
          sidebarActiveItem.parentItem.title || ""
        )
      }
      tempBreadcrumbItems.set(
        getLinkPath(sidebarActiveItem) || "/",
        sidebarActiveItem.title || ""
      )
    }

    return tempBreadcrumbItems
  }, [currentItems, sidebarActiveItem, breadcrumbOptions])

  return (
    <div
      className={clsx(
        "flex items-center gap-docs_0.25",
        "text-medusa-fg-muted text-compact-small",
        "mb-docs_1 flex-wrap"
      )}
    >
      {Array.from(breadcrumbItems).map(([link, title], index) => (
        <React.Fragment key={link}>
          {index > 0 && <TriangleRightMini />}
          <Button
            variant="transparent-clear"
            className={clsx(
              "px-docs_0.5 py-docs_0.25",
              link === "#" && "hover:cursor-default",
              "!p-0 hover:!bg-transparent hover:!text-medusa-fg-subtle"
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
