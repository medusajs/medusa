import { EllipseMiniSolid } from "@medusajs/icons"
import clsx from "clsx"
import Link from "next/link"
import React from "react"
import { ToCItemUi } from "types"

export type TocMenuProps = {
  items: ToCItemUi[]
  activeItem: string
}

export const TocMenu = ({ items, activeItem }: TocMenuProps) => {
  const getItemElm = (item: ToCItemUi) => {
    const isActive = item.id === activeItem
    const hasChildren = item.children?.length || 0 > 0
    return (
      <li
        className={clsx(
          "text-medusa-fg-base px-docs_0.5",
          isActive && "text-compact-small-plus",
          !isActive && "text-compact-small"
        )}
      >
        <Link
          className={clsx(
            "flex justify-start items-center gap-docs_0.5",
            "cursor-pointer rounded-docs_xs py-docs_0.25",
            "hover:bg-medusa-bg-component-hover"
          )}
          href={`#${item.id}`}
        >
          <EllipseMiniSolid className={clsx(!isActive && "invisible")} />
          <span>{item.title}</span>
        </Link>
        {hasChildren && (
          <ul>
            {item.children!.map((childItem, index) => (
              <React.Fragment key={index}>
                {getItemElm(childItem)}
              </React.Fragment>
            ))}
          </ul>
        )}
      </li>
    )
  }

  return (
    <ul
      className={clsx(
        "p-docs_0.25 rounded z-50 w-[200px] max-w-[200px] max-h-[400px] overflow-y-scroll",
        "absolute -right-[100vw] group-hover:-right-docs_0.5",
        "bg-medusa-bg-component transition-[right]",
        "shadow-elevation-flyout dark:shadow-elevation-flyout-dark"
      )}
    >
      {items.map((item, index) => (
        <React.Fragment key={index}>{getItemElm(item)}</React.Fragment>
      ))}
    </ul>
  )
}
