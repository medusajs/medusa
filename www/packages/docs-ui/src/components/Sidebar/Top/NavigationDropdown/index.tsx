"use client"

import clsx from "clsx"
import React, { useMemo, useRef, useState } from "react"
import { SidebarTopNavigationDropdownSelected } from "./Selected"
import { SidebarTopNavigationDropdownMenu } from "./Menu"
import { useClickOutside, useSidebar } from "../../../.."

export const SidebarTopNavigationDropdown = () => {
  const { navigationDropdownItems: items } = useSidebar()
  const navigationRef = useRef<HTMLDivElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  useClickOutside({
    elmRef: navigationRef,
    onClickOutside: () => {
      setMenuOpen(false)
    },
  })

  const selectedItem = useMemo(() => {
    const activeItem = items.find(
      (item) => item.type === "link" && item.isActive
    )

    if (!activeItem) {
      return items.length ? items[0] : undefined
    }

    return activeItem
  }, [items])
  return (
    <div
      className={clsx(
        "py-docs_0.125 pl-docs_0.125 pr-docs_0.5",
        "relative z-50 lg:mb-docs_0.75"
      )}
      ref={navigationRef}
    >
      {selectedItem && (
        <SidebarTopNavigationDropdownSelected
          item={selectedItem}
          onClick={() => setMenuOpen((prev) => !prev)}
        />
      )}
      <SidebarTopNavigationDropdownMenu
        items={items}
        open={menuOpen}
        onSelect={() => setMenuOpen(false)}
      />
    </div>
  )
}
