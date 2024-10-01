"use client"

import React, { useMemo } from "react"
import clsx from "clsx"
import { CodeBlockStyle } from ".."
import { useColorMode } from "@/providers"
import { Badge, BadgeVariant } from "@/components"
import { CodeBlockActions, CodeBlockActionsProps } from "../Actions"
import { CodeBlockHeaderWrapper } from "./Wrapper"

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
    <CodeBlockHeaderWrapper blockStyle={blockStyle}>
      <div className={clsx("flex-1", "flex gap-docs_0.75 items-start")}>
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
    </CodeBlockHeaderWrapper>
  )
}
