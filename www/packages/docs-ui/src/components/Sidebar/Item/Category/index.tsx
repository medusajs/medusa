"use client"

// @refresh reset

import React, { useEffect, useMemo, useState } from "react"
import { Sidebar } from "types"
import { Badge } from "@/components/Badge"
import { Loading } from "@/components/Loading"
import { SidebarItem } from "@/components/Sidebar/Item"
import { useSidebar } from "@/providers/Sidebar"
import clsx from "clsx"
import { TriangleDownMini, TriangleUpMini } from "@medusajs/icons"

export type SidebarItemCategoryProps = {
  item: Sidebar.SidebarItemCategory
} & React.AllHTMLAttributes<HTMLDivElement>

export const SidebarItemCategory = ({
  item,
  className,
}: SidebarItemCategoryProps) => {
  const [showLoading, setShowLoading] = useState(false)
  const [open, setOpen] = useState(
    item.initialOpen !== undefined ? item.initialOpen : false
  )
  const {
    isItemActive,
    updatePersistedCategoryState,
    getPersistedCategoryState,
    persistCategoryState,
  } = useSidebar()
  const itemShowLoading = useMemo(() => {
    return !item.loaded || (item.showLoadingIfEmpty && !item.children?.length)
  }, [item])
  const isActive = useMemo(() => {
    return isItemActive({
      item,
    })
  }, [isItemActive, item])

  useEffect(() => {
    if (open && itemShowLoading) {
      setShowLoading(true)
    }
  }, [open, itemShowLoading])

  useEffect(() => {
    if (!itemShowLoading && showLoading) {
      setShowLoading(false)
    }
  }, [itemShowLoading, showLoading])

  useEffect(() => {
    if (isActive && !open) {
      setOpen(true)
    }
  }, [isActive, item.children])

  useEffect(() => {
    if (!persistCategoryState) {
      return
    }
    const persistedOpen = getPersistedCategoryState(item.title)
    if (persistedOpen !== undefined && !isActive) {
      setOpen(persistedOpen)
    }
  }, [persistCategoryState])

  const handleOpen = () => {
    if (!open) {
      item.onOpen?.()
    }
    if (persistCategoryState) {
      updatePersistedCategoryState(item.title, !open)
    }
    setOpen((prev) => !prev)
  }

  const isTitleOneWord = useMemo(
    () => item.title.split(" ").length === 1,
    [item.title]
  )

  return (
    <div
      className={clsx("my-docs_0.75 first:!mt-0 w-full relative", className)}
      data-testid="sidebar-item-category-container"
    >
      <div className="px-docs_0.75">
        <div
          className={clsx(
            "py-docs_0.25 px-docs_0.5",
            "flex justify-between items-center gap-docs_0.5",
            "text-medusa-fg-muted",
            "cursor-pointer relative",
            "z-[2]",
            !isTitleOneWord && "break-words"
          )}
          tabIndex={-1}
          onClick={handleOpen}
          data-testid="sidebar-item-category"
        >
          <span
            className={clsx(
              "text-compact-x-small-plus",
              isTitleOneWord && "truncate"
            )}
            data-testid="sidebar-item-title"
          >
            {item.title}
          </span>
          {item.additionalElms}
          {item.badge && (
            <Badge variant={item.badge.variant}>{item.badge.text}</Badge>
          )}
          {!item.additionalElms && (
            <>
              {open && <TriangleDownMini />}
              {!open && <TriangleUpMini />}
            </>
          )}
        </div>
      </div>
      {!item.hideChildren && (
        <ul
          className={clsx(
            "ease-ease",
            "flex flex-col gap-docs_0.125",
            "z-[1] relative",
            !open && "overflow-hidden m-0 h-0"
          )}
          data-testid="sidebar-item-category-children"
        >
          {item.children?.map((childItem, index) => (
            <SidebarItem
              item={childItem}
              key={index}
              isParentCategoryOpen={open}
            />
          ))}
          {showLoading && (
            <Loading
              count={3}
              className="!mb-0 !px-docs_0.5"
              barClassName="h-[20px]"
            />
          )}
        </ul>
      )}
    </div>
  )
}
