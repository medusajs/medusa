"use client"

import clsx from "clsx"
import React, { useMemo } from "react"
import { ToCItemUi } from "types"
import { TocList } from "../List"

export type TocItemProps = {
  item: ToCItemUi
  activeItem: string
}

export const TocItem = ({ item, activeItem }: TocItemProps) => {
  const isActive = useMemo(() => item.id === activeItem, [item, activeItem])

  return (
    <li>
      <span
        className={clsx(
          "h-docs_0.125 rounded-full transition-colors",
          isActive && "bg-medusa-fg-subtle",
          !isActive && "bg-medusa-fg-disabled hover:bg-medusa-fg-subtle",
          item.level === 2 && "w-[20px]",
          item.level === 3 && "w-[10px]",
          "cursor-pointer block"
        )}
      ></span>
      {(item.children?.length || 0) > 0 && (
        <TocList items={item.children!} activeItem={activeItem} />
      )}
    </li>
  )
}
