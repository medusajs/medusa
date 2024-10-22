"use client"

// @refresh reset

import React, { useEffect, useMemo, useRef, useState } from "react"
import { SidebarItemCategory as SidebarItemCategoryType } from "types"
import { Loading, SidebarItem, useSidebar } from "../../../.."
import clsx from "clsx"
import { MinusMini, PlusMini } from "@medusajs/icons"

export type SidebarItemCategory = {
  item: SidebarItemCategoryType
  expandItems?: boolean
} & React.AllHTMLAttributes<HTMLDivElement>

export const SidebarItemCategory = ({
  item,
  expandItems = true,
  className,
}: SidebarItemCategory) => {
  const [showLoading, setShowLoading] = useState(false)
  const [open, setOpen] = useState(
    item.initialOpen !== undefined ? item.initialOpen : expandItems
  )
  const childrenRef = useRef<HTMLUListElement>(null)
  const {
    isChildrenActive,
    updatePersistedCategoryState,
    getPersistedCategoryState,
    persistState,
    activePath,
  } = useSidebar()
  const itemShowLoading = useMemo(() => {
    return !item.loaded || (item.showLoadingIfEmpty && !item.children?.length)
  }, [item])

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
    const isActive = isChildrenActive(item)

    if (isActive && !open) {
      setOpen(true)
    }
  }, [isChildrenActive, item.children])

  useEffect(() => {
    if (!persistState) {
      return
    }
    const persistedOpen = getPersistedCategoryState(item.title)
    if (persistedOpen !== undefined) {
      setOpen(persistedOpen)
    }
  }, [persistState])

  const handleOpen = () => {
    item.onOpen?.()
  }

  const isTitleOneWord = useMemo(
    () => item.title.split(" ").length === 1,
    [item.title]
  )

  return (
    <div
      className={clsx("my-docs_0.75 first:!mt-0 w-full relative", className)}
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
          onClick={() => {
            if (!open) {
              handleOpen()
            }
            if (persistState) {
              updatePersistedCategoryState(item.title, !open)
            }
            setOpen((prev) => !prev)
          }}
        >
          <span
            className={clsx(
              "text-compact-x-small-plus",
              isTitleOneWord && "truncate"
            )}
          >
            {item.title}
          </span>
          {item.additionalElms}
          {!item.additionalElms && (
            <>
              {open && <MinusMini />}
              {!open && <PlusMini />}
            </>
          )}
        </div>
      </div>
      <ul
        className={clsx(
          "ease-ease",
          "flex flex-col gap-docs_0.125",
          "z-[1] relative",
          !open && "overflow-hidden m-0 h-0"
        )}
        ref={childrenRef}
      >
        {showLoading && (
          <Loading
            count={3}
            className="!mb-0 !px-docs_0.5"
            barClassName="h-[20px]"
          />
        )}
        {item.children?.map((childItem, index) => (
          <SidebarItem item={childItem} key={index} expandItems={expandItems} />
        ))}
      </ul>
    </div>
  )
}
