"use client"

import React from "react"
import { BaseTabType, useScrollPositionBlocker } from "@/hooks"
import { useColorMode } from "@/providers"
import clsx from "clsx"

type CodeTabProps = BaseTabType & {
  children: React.ReactNode
  isSelected?: boolean
  blockStyle?: string
  changeSelectedTab?: (tab: BaseTabType) => void
  pushRef?: (tabButton: HTMLButtonElement | null) => void
}

export const CodeTab = ({
  label,
  value,
  isSelected = false,
  blockStyle = "loud",
  changeSelectedTab,
  pushRef,
}: CodeTabProps) => {
  const { colorMode } = useColorMode()
  const { blockElementScrollPositionUntilNextRender } =
    useScrollPositionBlocker()

  return (
    <li>
      <button
        className={clsx(
          "text-compact-x-small-plus font-base xs:border-0 pb-docs_0.5 relative",
          !isSelected && [
            blockStyle === "loud" && "text-medusa-contrast-fg-secondary",
            blockStyle === "subtle" && [
              colorMode === "light" &&
                "text-medusa-fg-subtle hover:bg-medusa-bg-base",
              colorMode === "dark" &&
                "text-medusa-contrast-fg-secondary hover:bg-medusa-code-bg-base",
            ],
          ],
          isSelected && [
            blockStyle === "loud" && "text-medusa-contrast-fg-primary",
            blockStyle === "subtle" && [
              colorMode === "light" &&
                "xs:border-medusa-border-base text-medusa-contrast-fg-primary",
              colorMode === "dark" &&
                "xs:border-medusa-code-border text-medusa-contrast-fg-primary",
            ],
          ]
        )}
        ref={(tabButton) => pushRef?.(tabButton)}
        onClick={(e) => {
          blockElementScrollPositionUntilNextRender(
            e.target as HTMLButtonElement
          )
          changeSelectedTab?.({ label, value })
        }}
        aria-selected={isSelected}
        role="tab"
      >
        {label}
      </button>
    </li>
  )
}
