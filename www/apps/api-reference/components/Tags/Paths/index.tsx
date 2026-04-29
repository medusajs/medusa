"use client"

import React from "react"
import type { OpenAPI } from "types"
import { findSidebarItem, useSidebar } from "docs-ui"
import { Fragment, Suspense, useEffect, useMemo } from "react"
import dynamic from "next/dynamic"
import type { TagOperationProps } from "../Operation"
import clsx from "clsx"
import getTagChildSidebarItems from "@/utils/get-tag-child-sidebar-items"
import { useLoading } from "@/providers/loading"
import DividedLoading from "@/components/DividedLoading"
import { Sidebar } from "types"
import { compareOperations } from "@/utils/sort-operations-utils"

const TagOperation = dynamic<TagOperationProps>(
  async () => import("../Operation")
) as React.FC<TagOperationProps>

export type TagPathsProps = {
  tag: OpenAPI.TagObject
  paths: OpenAPI.PathsObject
} & React.HTMLAttributes<HTMLDivElement>

const TagPaths = ({ tag, className, paths }: TagPathsProps) => {
  const { shownSidebar, addItems } = useSidebar()
  const { loading } = useLoading()

  useEffect(() => {
    if (!shownSidebar || !Object.keys(paths).length) {
      return
    }

    const parentItem = findSidebarItem({
      sidebarItems:
        "items" in shownSidebar
          ? shownSidebar.items
          : shownSidebar.children || [],
      item: { title: tag.name, type: "category" },
      checkChildren: false,
    }) as Sidebar.SidebarItemCategory | undefined
    const pathItems: Sidebar.SidebarItem[] = getTagChildSidebarItems(paths)
    const targetLength = pathItems.length + (tag["x-associatedSchema"] ? 1 : 0)
    if (parentItem && (parentItem.children?.length || 0) < targetLength) {
      addItems(pathItems, {
        sidebar_id: shownSidebar.sidebar_id,
        parent: {
          type: "category",
          title: tag.name,
          path: "",
          changeLoaded: true,
        },
        indexPosition: tag["x-associatedSchema"] ? 1 : 0,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paths, shownSidebar?.sidebar_id])

  const sortedOperations = useMemo(() => {
    const sortedOperations: {
      endpointPath: string
      method: string
      operation: OpenAPI.Operation
    }[] = []

    Object.entries(paths).forEach(([endpointPath, operations]) => {
      Object.entries(operations).forEach(([method, operation]) => {
        sortedOperations.push({
          endpointPath,
          method,
          operation: operation as OpenAPI.Operation,
        })
      })
    })

    sortedOperations.sort((a, b) => {
      return compareOperations({
        httpMethodA: a.method,
        httpMethodB: b.method,
        summaryA: a.operation.summary,
        summaryB: b.operation.summary,
      })
    })

    return sortedOperations
  }, [paths])

  return (
    <Suspense>
      <div className={clsx("relative", className)}>
        {loading && <DividedLoading className="mt-7" />}
        {sortedOperations.map(
          ({ endpointPath, method, operation }, operationIndex) => (
            <Fragment key={operationIndex}>
              <TagOperation
                method={method}
                operation={operation}
                tag={tag}
                key={`${operationIndex}`}
                endpointPath={endpointPath}
                className={clsx("pt-7")}
              />
            </Fragment>
          )
        )}
      </div>
    </Suspense>
  )
}

export default TagPaths
