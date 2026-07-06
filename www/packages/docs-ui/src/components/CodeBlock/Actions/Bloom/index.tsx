"use client"

import React from "react"
import clsx from "clsx"
import { Tooltip } from "../../../Tooltip"
import { BloomIcon } from "../../../Icons"
import { useAnalytics } from "../../../../providers/Analytics"
import { DocsTrackingEvents } from "../../../../constants"

export type CodeBlockBloomActionProps = {
  source: string
  inHeader: boolean
}

export const CodeBlockBloomAction = ({
  source,
  inHeader,
}: CodeBlockBloomActionProps) => {
  const { track } = useAnalytics()

  const handleClick = () => {
    window.parent.postMessage(
      {
        type: "MEDUSA_AI_SEND_PROMPT",
        data: {
          prompt: source.trim(),
        },
      },
      "*"
    )
    track({
      event: {
        event: DocsTrackingEvents.BLOOM_ACTION,
        options: {
          type: "send_to_bloom",
          code: source.trim(),
        },
      },
    })
  }

  return (
    <Tooltip
      text="Send to Bloom"
      tooltipClassName="font-base"
      className={clsx("group")}
      innerClassName={clsx(
        inHeader && "flex",
        "h-fit rounded-docs_sm",
        "group-hover:bg-medusa-contrast-bg-base-hover group-focus:bg-medusa-contrast-bg-base-hover"
      )}
    >
      <span
        className={clsx(
          !inHeader && "p-[6px]",
          inHeader && "p-[4.5px]",
          "cursor-pointer",
          "text-medusa-contrast-fg-secondary group-hover:text-medusa-contrast-fg-primary",
          "group-focus:text-medusa-contrast-fg-primary"
        )}
        onClick={handleClick}
      >
        <BloomIcon />
      </span>
    </Tooltip>
  )
}
