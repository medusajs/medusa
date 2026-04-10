"use client"

import React from "react"
import { useAiAssistant } from "../../../../providers/AiAssistant"
import clsx from "clsx"
import { Tooltip } from "../../../Tooltip"
import { useChat } from "@kapaai/react-sdk"
import { BloomIcon } from "../../../Icons"
import { useSiteConfig } from "../../../../providers/SiteConfig"

export type CodeBlockCopyActionProps = {
  source: string
  inHeader: boolean
}

export const CodeBlockAskAiAction = ({
  source,
  inHeader,
}: CodeBlockCopyActionProps) => {
  const { setChatOpened, loading } = useAiAssistant()
  const { config } = useSiteConfig()
  const { submitQuery } = useChat()

  if (!config.features?.aiAssistant) {
    return null
  }

  const handleClick = () => {
    if (loading) {
      return
    }
    submitQuery(`\`\`\`tsx\n${source.trim()}\n\`\`\`\n\nExplain the code above`)
    setChatOpened(true)
  }

  return (
    <Tooltip
      text="Ask Bloom"
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
