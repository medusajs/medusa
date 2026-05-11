"use client"

import React, { useState, useEffect } from "react"
import { Card } from "../../../Card"
import { useChat } from "@kapaai/react-sdk"
import { useAiAssistant } from "../../../../providers/AiAssistant"
import { useMedusaSuggestions } from "../../../../hooks/use-medusa-suggestions"
import { useAnalytics } from "../../../../providers/Analytics"
import { DocsTrackingEvents } from "../../../../constants"
import clsx from "clsx"
import { XMark } from "@medusajs/icons"
import { Button } from "../../../Button"

type AiAssistantChatWindowCalloutProps = {
  className?: string
}

export const AiAssistantChatWindowCallout = ({
  className,
}: AiAssistantChatWindowCalloutProps) => {
  const { conversation } = useChat()
  const { loading } = useAiAssistant()
  const { track } = useAnalytics()
  const [dismissed, setDismissed] = useState(false)

  const lastQuestion = conversation.getLatestCompleted()?.question

  const matchedCallout = useMedusaSuggestions({
    keywords: lastQuestion || "",
  })

  // Reset dismissed state when the question changes so each new question
  // gets a fresh opportunity to surface its matched callout suggestion.
  useEffect(() => {
    setDismissed(false)
  }, [lastQuestion])

  if (loading || !matchedCallout || dismissed) {
    return null
  }

  return (
    <div className={clsx("px-docs_1 pt-docs_1", className)}>
      <div className="flex justify-center items-center">
        {/* Relative wrapper ensures the dismiss button is anchored to the
            card itself, not the outer flex container edge. */}
        <div className="relative">
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
          <Button
            variant="transparent-clear"
            className="!p-[6.5px] rounded-docs_sm absolute top-0 right-0"
            onClick={() => setDismissed(true)}
            aria-label="Dismiss Bloom AI suggestion"
          >
            <XMark className="text-medusa-fg-muted" height={12} width={12} />
          </Button>
        </div>
      </div>
    </div>
  )
}
