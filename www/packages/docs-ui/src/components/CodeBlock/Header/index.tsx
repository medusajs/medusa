"use client"

import React, { useMemo } from "react"
import clsx from "clsx"
import { CodeBlockStyle } from ".."
import { useColorMode } from "@/providers"
import { Badge, BadgeVariant } from "@/components"
import { CodeBlockActions, CodeBlockActionsProps } from "../Actions"

export type CodeBlockHeaderMeta = {
  badgeLabel?: string
  badgeColor?: BadgeVariant
}

type CodeBlockHeaderProps = {
  title?: string
  blockStyle?: CodeBlockStyle
  actionsProps: CodeBlockActionsProps
} & CodeBlockHeaderMeta

export const CodeBlockHeader = ({
  title,
  blockStyle = "loud",
  badgeLabel,
  actionsProps,
  badgeColor,
}: CodeBlockHeaderProps) => {
  const { colorMode } = useColorMode()

  const bgColor = useMemo(
    () =>
      clsx(
        blockStyle === "loud" && "bg-medusa-contrast-bg-base",
        blockStyle === "subtle" && [
          colorMode === "light" && "bg-medusa-bg-component",
          colorMode === "dark" && "bg-medusa-code-bg-header",
        ]
      ),
    [blockStyle, colorMode]
  )
  const titleColor = useMemo(
    () =>
      clsx(
        blockStyle === "loud" && "text-medusa-contrast-fg-secondary",
        blockStyle === "subtle" && [
          colorMode === "light" && "text-medusa-fg-subtle",
          colorMode === "dark" && "text-medusa-contrast-fg-secondary",
        ]
      ),
    [blockStyle, colorMode]
  )

  return (
    <div
      className={clsx(
        "py-docs_0.5 px-docs_1 mb-0",
        "rounded-t-docs_lg relative",
        blockStyle === "subtle" && [
          "border border-solid border-b-0",
          colorMode === "light" && "border-medusa-border-base",
          colorMode === "dark" && "border-medusa-code-border",
        ],
        bgColor
      )}
    >
      <div className={clsx("xs:max-w-[83%]", "flex gap-docs_0.75 items-start")}>
        {badgeLabel && (
          <Badge variant={badgeColor || "code"} className="font-base">
            {badgeLabel}
          </Badge>
        )}
        {title && (
          <div className={clsx("text-compact-x-small font-base", titleColor)}>
            {title}
          </div>
        )}
      </div>
      <CodeBlockActions {...actionsProps} />
    </div>
  )
}
