"use client"

import Link from "next/link"
import React, { useMemo } from "react"
import { MarkdownIcon } from "../../Icons/Markdown"
import { useSiteConfig } from "@/providers/SiteConfig"
import { useAiAssistant } from "@/providers/AiAssistant"
import { usePathname } from "next/navigation"
import { BroomSparkle } from "@medusajs/icons"
import { useChat } from "@kapaai/react-sdk"

export const ContentMenuActions = () => {
  const {
    config: { baseUrl, basePath, features },
  } = useSiteConfig()
  const pathname = usePathname()
  const { setChatOpened } = useAiAssistant()
  const { isGeneratingAnswer, isPreparingAnswer, submitQuery } = useChat()
  const loading = useMemo(
    () => isGeneratingAnswer || isPreparingAnswer,
    [isGeneratingAnswer, isPreparingAnswer]
  )
  const pageUrl = `${baseUrl}${basePath}${pathname}`.replace(/\/$/, "")

  const handleAiAssistantClick = () => {
    if (loading) {
      return
    }
    submitQuery(`Explain the page ${pageUrl}`)
    setChatOpened(true)
  }

  return (
    <div className="flex flex-col gap-docs_0.5">
      <Link
        className="flex items-center gap-docs_0.5 text-medusa-fg-subtle text-x-small-plus hover:text-medusa-fg-base"
        href={`${pageUrl}/index.html.md`}
        data-testid="markdown-link"
      >
        <MarkdownIcon width={15} height={15} />
        View as Markdown
      </Link>
      {features?.aiAssistant && (
        <button
          className="appearance-none p-0 flex items-center gap-docs_0.5 text-medusa-fg-subtle text-x-small-plus hover:text-medusa-fg-base"
          onClick={handleAiAssistantClick}
          data-testid="ai-assistant-button"
        >
          <BroomSparkle width={15} height={15} />
          Explain this page
        </button>
      )}
    </div>
  )
}
