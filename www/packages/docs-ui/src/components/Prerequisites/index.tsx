"use client"

import React from "react"
import { Button, useCollapsible } from "../.."
import clsx from "clsx"
import { TriangleRightMini } from "@medusajs/icons"
import {
  PrerequisiteItem,
  PrerequisiteItemPosition,
  PrerequisiteItemType,
} from "./Item"

type PrerequisitesProps = {
  items: PrerequisiteItemType[]
}

export const Prerequisites = ({ items }: PrerequisitesProps) => {
  const { collapsed, getCollapsibleElms, setCollapsed } = useCollapsible({
    initialValue: false,
    translateEnabled: false,
  })

  const getPosition = (index: number): PrerequisiteItemPosition => {
    if (items.length === 1) {
      return "alone"
    }

    if (index === items.length - 1) {
      return "bottom"
    }

    return index === 0 ? "top" : "middle"
  }

  return (
    <details
      open={!collapsed}
      onClick={(event) => {
        event.preventDefault()
      }}
      onToggle={(event) => {
        // this is to avoid event propagation
        // when details are nested, which is a bug
        // in react. Learn more here:
        // https://github.com/facebook/react/issues/22718
        event.stopPropagation()
      }}
      className="my-docs_1"
    >
      <summary
        className="flex no-marker items-center mb-[6px] w-fit"
        onClick={() => setCollapsed((prev) => !prev)}
      >
        <Button
          className={clsx(
            "flex items-center",
            "px-docs_0.5 py-docs_0.25",
            "text-medusa-fg-subtle",
            "active:!outline-none active:!shadow-none",
            "focus:!outline-none focus:!shadow-none"
          )}
          variant="transparent-clear"
        >
          <TriangleRightMini
            className={clsx("transition-transform", !collapsed && "rotate-90")}
          />
          <span className="text-compact-small-plus block ml-[6px]">
            Prerequisites
          </span>
          <span className="fg-muted text-compact-small">{items.length}</span>
        </Button>
      </summary>
      {getCollapsibleElms(
        <div className="flex gap-[6px] flex-col">
          {items.map((item, index) => (
            <PrerequisiteItem
              item={{
                ...item,
                position: getPosition(index),
              }}
              key={index}
            />
          ))}
        </div>
      )}
    </details>
  )
}
