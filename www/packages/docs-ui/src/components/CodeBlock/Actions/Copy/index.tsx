"use client"

import React, { useEffect, useMemo, useState } from "react"
import { CopyButton } from "../../../CopyButton"
import { DocsTrackingEvents } from "../../../../constants"
import { useAnalytics } from "../../../../providers/Analytics"
import clsx from "clsx"
import { CheckMini, SquareTwoStack } from "@medusajs/icons"
import { CodeBlockStyle } from "../.."

export type CodeBlockCopyActionProps = {
  source: string
  inHeader: boolean
  codeBlockStyle?: CodeBlockStyle
}

export const CodeBlockCopyAction = ({
  source,
  inHeader,
  codeBlockStyle = "loud",
}: CodeBlockCopyActionProps) => {
  const [copied, setCopied] = useState(false)
  const { track } = useAnalytics()

  useEffect(() => {
    if (!copied) {
      return
    }

    setTimeout(() => {
      setCopied(false)
    }, 1000)

    track({
      event: {
        event: DocsTrackingEvents.CODE_BLOCK_COPY,
        options: {
          text: source.substring(0, 150),
        },
      },
    })
  }, [copied])

  const iconClassName = useMemo(() => {
    if (codeBlockStyle === "loud") {
      return [
        "text-medusa-contrast-fg-secondary",
        "group-hover:text-medusa-contrast-fg-primary",
        "group-focus:text-medusa-contrast-fg-primary",
      ]
    }

    return [
      "text-medusa-fg-muted",
      "group-hover:text-medusa-fg-subtle",
      "group-focus:text-medusa-fg-subtle",
    ]
  }, [codeBlockStyle])

  return (
    <CopyButton
      text={source}
      tooltipClassName="font-base"
      className={clsx("group")}
      buttonClassName={clsx(!inHeader && "p-[6px]", inHeader && "p-[4.5px]")}
      tooltipInnerClassName={clsx(
        inHeader && "flex",
        "h-fit rounded-docs_sm",
        codeBlockStyle === "loud" && "group-hover:bg-medusa-contrast-bg-base-hover group-focus:bg-medusa-contrast-bg-base-hover",
        codeBlockStyle === "subtle" && "group-hover:bg-medusa-bg-component group-focus:bg-medusa-bg-component"
      )}
      onCopy={() => setCopied(true)}
    >
      {!copied && (
        <SquareTwoStack
          className={clsx(iconClassName)}
          data-testid="not-copied-icon"
        />
      )}
      {copied && (
        <CheckMini className={clsx(iconClassName)} data-testid="copied-icon" />
      )}
    </CopyButton>
  )
}
