"use client"

import React from "react"
import { Card } from "../../../Card"
import { useChat } from "@kapaai/react-sdk"
import { useAiAssistant } from "../../../../providers/AiAssistant"
import { useMedusaSuggestions } from "../../../../hooks/use-medusa-suggestions"
import { useAnalytics } from "../../../../providers/Analytics"
import { DocsTrackingEvents } from "../../../../constants"
import clsx from "clsx"

type AiAssistantChatWindowCalloutProps = {
  className?: string
}

export const AiAssistantChatWindowCallout = ({
  className,
}: AiAssistantChatWindowCalloutProps) => {
  const { conversation } = useChat()
  const { loading } = useAiAssistant()
  const { track } = useAnalytics()

  const lastQuestion = conversation.getLatestCompleted()?.question

  const matchedCallout = useMedusaSuggestions({
    keywords: lastQuestion || "",
  })

  if (loading || !matchedCallout) {
    return null
  }

  return (
    <div className={clsx("px-docs_1 pt-docs_1", className)}>
      <div className="flex justify-center items-center">
        <Card
          {...matchedCallout}
          type="bloom"
          onClick={() => {
            track({
              event: {
                event: DocsTrackingEvents.AI_ASSISTANT_CALLOUT_CLICK,
                options: {
                  user_keywords: lastQuestion || "",
                  callout_title: matchedCallout.title || "",
                  callout_href: matchedCallout.href || "",
                },
              },
            })
          }}
        />
      </div>
    </div>
  )
}
