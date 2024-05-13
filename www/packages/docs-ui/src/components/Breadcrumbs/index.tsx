"use client"

import React, { useMemo } from "react"
import { CurrentItemsState, useSidebar } from "@/providers"
import { TriangleRightMini } from "@medusajs/icons"
import Link from "next/link"
import clsx from "clsx"

type BreadcrumbItem = Map<string, string>

export const Breadcrumbs = () => {
  const { currentItems } = useSidebar()

  const getBreadcrumbsOfItem = (item: CurrentItemsState): BreadcrumbItem => {
    let tempBreadcrumbItems: BreadcrumbItem = new Map()
    if (item.previousSidebar) {
      tempBreadcrumbItems = getBreadcrumbsOfItem(item.previousSidebar)
    }

    tempBreadcrumbItems.set(
      item.parentItem?.path || item.top[0].path || "/",
      item.parentItem?.childSidebarTitle || item.parentItem?.title || ""
    )

    return tempBreadcrumbItems
  }

  const breadcrumbItems = useMemo(() => {
    const tempBreadcrumbItems: BreadcrumbItem = new Map()
    if (!currentItems) {
      return tempBreadcrumbItems
    }

    tempBreadcrumbItems.set("/", "Home")

    getBreadcrumbsOfItem(currentItems).forEach((value, key) =>
      tempBreadcrumbItems.set(key, value)
    )

    return tempBreadcrumbItems
  }, [currentItems])

  const getBreadcrumbItemElms = (): React.ReactNode[] => {
    const elms: React.ReactNode[] = []
    breadcrumbItems.forEach((title, path) => {
      elms.push(
        <React.Fragment key={path}>
          {elms.length !== 0 && (
            <TriangleRightMini className={clsx("text-medusa-fg-muted")} />
          )}
          <Link
            href={path}
            className={clsx(
              "text-compact-x-small-plus text-medusa-fg-muted",
              "hover:text-medusa-fg-subtle transition-colors"
            )}
          >
            {title}
          </Link>
        </React.Fragment>
      )
    })

    return elms
  }

  return (
    <>
      {breadcrumbItems.size > 0 && (
        <div className="flex gap-docs_0.25 items-center mb-docs_1">
          {...getBreadcrumbItemElms()}
        </div>
      )}
    </>
  )
}
