"use client"

// @refresh reset

import React, { useMemo, useRef } from "react"
import { Sidebar } from "types"
import { Badge } from "@/components/Badge"
import { SidebarItem } from "@/components/Sidebar/Item"
import clsx from "clsx"

export type SidebarItemSubCategoryProps = {
  item: Sidebar.SidebarItemSubCategory
  nested?: boolean
  isParentCategoryOpen?: boolean
} & React.AllHTMLAttributes<HTMLLIElement>

export const SidebarItemSubCategory = ({
  item,
  className,
  nested = false,
  isParentCategoryOpen,
}: SidebarItemSubCategoryProps) => {
  const ref = useRef<HTMLLIElement>(null)

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
        <span
          className={clsx(
            "py-docs_0.25 px-docs_0.5",
            "block w-full",
            !isTitleOneWord && "break-words",
            !nested && "text-medusa-fg-subtle",
            nested && "text-medusa-fg-muted",
            "text-compact-small-plus",
            className
          )}
          data-testid="sidebar-item-container"
        >
          <span
            className={clsx(
              isTitleOneWord && "truncate",
              nested && "pl-docs_1.5"
            )}
            data-testid="sidebar-item-title"
          >
            {item.title}
          </span>
          {item.additionalElms}
          {item.badge && (
            <Badge variant={item.badge.variant}>{item.badge.text}</Badge>
          )}
        </span>
      </span>
      {hasChildren && (
        <ul
          className={clsx(
            "ease-ease",
            "flex flex-col gap-docs_0.125",
            "pb-docs_0.5 pt-docs_0.125"
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
