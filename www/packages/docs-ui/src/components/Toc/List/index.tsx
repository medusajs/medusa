import clsx from "clsx"
import React from "react"
import { ToCItemUi } from "types"
import { TocItem } from "../Item"
import { TocMenu } from "../Menu"

export type TocListProps = {
  items: ToCItemUi[]
  topLevel?: boolean
  activeItem: string
}

export const TocList = ({
  items,
  topLevel = false,
  activeItem,
}: TocListProps) => {
  return (
    <ul
      className={clsx(
        "flex flex-col gap-docs_0.75 items-end",
        !topLevel && "mt-docs_0.75",
        topLevel && "group relative"
      )}
    >
      {items.map((item, key) => (
        <TocItem item={item} key={key} activeItem={activeItem} />
      ))}
      {topLevel && <TocMenu items={items} activeItem={activeItem} />}
    </ul>
  )
}
