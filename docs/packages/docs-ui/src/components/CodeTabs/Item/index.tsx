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
          "text-compact-small-plus xs:border-0 py-docs_0.25 px-docs_0.75 relative rounded-full border",
          !isSelected && [
            "text-medusa-code-text-subtle border-transparent",
            blockStyle === "loud" && [
              colorMode === "light" &&
                "text-medusa-code-text-subtle hover:bg-medusa-code-bg-base",
              colorMode === "dark" &&
                "text-medusa-fg-muted hover:bg-medusa-bg-component",
            ],
            blockStyle === "subtle" && [
              colorMode === "light" &&
                "text-medusa-fg-subtle hover:bg-medusa-bg-base",
              colorMode === "dark" &&
                "text-medusa-code-text-subtle hover:bg-medusa-code-bg-base",
            ],
          ],
          isSelected && [
            "xs:!bg-transparent",
            blockStyle === "loud" && [
              colorMode === "light" &&
                "border-medusa-code-border text-medusa-code-text-base",
              colorMode === "dark" &&
                "border-medusa-border-base text-medusa-fg-base",
            ],
            blockStyle === "subtle" && [
              colorMode === "light" &&
                "xs:border-medusa-border-base text-medusa-code-text-base",
              colorMode === "dark" &&
                "xs:border-medusa-code-border text-medusa-code-text-base",
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
