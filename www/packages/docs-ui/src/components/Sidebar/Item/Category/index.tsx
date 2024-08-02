"use client"

// @refresh reset

import React, { useEffect, useRef, useState } from "react"
import { SidebarItemCategory as SidebarItemCategoryType } from "types"
import { Loading, SidebarItem, useSidebar } from "../../../.."
import clsx from "clsx"
import { MinusMini, PlusMini } from "@medusajs/icons"
import { CSSTransition } from "react-transition-group"

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
  const [open, setOpen] = useState(expandItems)
  const childrenRef = useRef<HTMLUListElement>(null)
  const { isCategoryChildrenActive } = useSidebar()

  useEffect(() => {
    if (open && !item.loaded) {
      setShowLoading(true)
    }
  }, [open])

  useEffect(() => {
    if (item.loaded && showLoading) {
      setShowLoading(false)
    }
  }, [item])

  useEffect(() => {
    if (!item.autoExpandOnActive) {
      return
    }

    const isActive = isCategoryChildrenActive(item)
    if (isActive && !open) {
      setOpen(true)
    }
  }, [item.autoExpandOnActive, isCategoryChildrenActive, open])

  const handleOpen = () => {
    item.onOpen?.()
  }

  return (
    <div
      className={clsx(
        "my-docs_0.75 w-full lg:bg-medusa-bg-subtle relative overflow-hidden",
        className
      )}
    >
      <div
        className={clsx(
          "py-docs_0.25 px-docs_0.5",
          "flex justify-between items-center gap-docs_0.5",
          "text-medusa-fg-muted",
          "cursor-pointer relative",
          "z-[2] lg:bg-medusa-bg-subtle"
        )}
        tabIndex={-1}
        onClick={() => {
          if (!open) {
            handleOpen()
          }
          setOpen((prev) => !prev)
        }}
      >
        <span className="text-compact-x-small-plus">{item.title}</span>
        {item.additionalElms}
        {!item.additionalElms && (
          <>
            {open && <MinusMini />}
            {!open && <PlusMini />}
          </>
        )}
      </div>
      <CSSTransition
        in={open}
        nodeRef={childrenRef}
        classNames={{
          enter: "animate-slideInDown",
          exit: "animate-slideOutUp",
        }}
        timeout={150}
        onExited={() => {
          childrenRef.current?.classList.add("overflow-hidden", "m-0", "h-0")
        }}
        onEnter={() => {
          childrenRef.current?.classList.remove("overflow-hidden", "m-0", "h-0")
        }}
      >
        <ul
          className={clsx(
            "ease-ease",
            "flex flex-col gap-docs_0.125",
            "z-[1] relative",
            !expandItems && "overflow-hidden m-0 h-0"
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
            <SidebarItem
              item={childItem}
              key={index}
              expandItems={expandItems}
            />
          ))}
        </ul>
      </CSSTransition>
    </div>
  )
}
