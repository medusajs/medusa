"use client"

import { EllipseMiniSolid } from "@medusajs/icons"
import clsx from "clsx"
import React from "react"
import { ToCItemUi } from "types"
import { Button, useScrollController } from "../../.."

export type TocMenuProps = {
  items: ToCItemUi[]
  activeItem: string
  show: boolean
  setShow: (value: boolean) => void
}

export const TocMenu = ({ items, activeItem, show, setShow }: TocMenuProps) => {
  const { scrollToElement } = useScrollController()

  const getItemElm = (item: ToCItemUi) => {
    const isActive = item.id === activeItem
    const hasChildren = item.children?.length || 0 > 0
    return (
      <li className={clsx("text-medusa-fg-base w-full")}>
        <Button
          variant="transparent-clear"
          className={clsx(
            "gap-docs_0.5 flex-1",
            "cursor-pointer rounded-docs_sm py-docs_0.25",
            "px-docs_0.5 hover:bg-medusa-bg-component-hover",
            "!text-inherit max-w-full w-full",
            "focus:!outline-none focus:!shadow-none focus:dark:!shadow-none",
            "!flex !justify-start !items-center",
            isActive && "!text-compact-small-plus",
            !isActive && "!text-compact-small"
          )}
          onClick={() => {
            history.pushState({}, "", `#${item.id}`)
            const elm = document.getElementById(item.id) as HTMLElement
            scrollToElement(elm)
          }}
        >
          <EllipseMiniSolid className={clsx(!isActive && "invisible")} />
          <span className="truncate flex-1 text-left">{item.title}</span>
        </Button>
        {hasChildren && (
          <ul className="pl-docs_0.5">
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
    <div
      className={clsx(
        "hidden lg:flex relative transition-[width] lg:h-full",
        "w-0 z-50 bg-medusa-bg-subtle overflow-hidden flex flex-col justify-center",
        show && "lg:w-toc"
      )}
      onMouseLeave={() => setShow(false)}
    >
      <ul
        className={clsx(
          "p-docs_0.75 lg:w-toc max-h-full overflow-y-scroll",
          "absolute lg:-right-full transition-[right,opacity] opacity-0",
          show && "lg:right-0 lg:opacity-100"
        )}
      >
        {items.map((item, index) => (
          <React.Fragment key={index}>{getItemElm(item)}</React.Fragment>
        ))}
      </ul>
    </div>
  )
}
