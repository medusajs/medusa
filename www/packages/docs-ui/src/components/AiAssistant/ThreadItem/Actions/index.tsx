import React, { useState } from "react"
import { ThreadType } from "../.."
import clsx from "clsx"
import {
  Button,
  type ButtonProps,
  ThumbDownIcon,
  ThumbUpIcon,
} from "@/components"
import { Check, SquareTwoStack } from "@medusajs/icons"
import { useCopy } from "@/hooks"
import { AiAssistantFeedbackType, useAiAssistant } from "@/providers"

export type AiAssistantThreadItemActionsProps = {
  item: ThreadType
}

export const AiAssistantThreadItemActions = ({
  item,
}: AiAssistantThreadItemActionsProps) => {
  const { isCopied, handleCopy } = useCopy(item.content)
  const [feedback, setFeedback] = useState<AiAssistantFeedbackType | null>(null)
  const { sendFeedback } = useAiAssistant()

  const handleFeedback = async (
    reaction: AiAssistantFeedbackType,
    question_id?: string
  ) => {
    try {
      if (!question_id || feedback) {
        return
      }
      setFeedback(reaction)
      const response = await sendFeedback(question_id, reaction)

      if (response.status !== 200) {
        console.error("Error sending feedback:", response.status)
      }
    } catch (error) {
      console.error("Error sending feedback:", error)
    }
  }

  return (
    <div
      className={clsx(
        "hidden md:flex gap-docs_0.25",
        "text-medusa-fg-muted",
        "sticky top-docs_1"
      )}
    >
      <ActionButton onClick={handleCopy}>
        {isCopied ? <Check /> : <SquareTwoStack />}
      </ActionButton>
      {(feedback === null || feedback === "upvote") && (
        <ActionButton
          onClick={async () => handleFeedback("upvote", item.question_id)}
          className={clsx(feedback === "upvote" && "!text-medusa-fg-subtle")}
        >
          <ThumbUpIcon />
        </ActionButton>
      )}
      {(feedback === null || feedback === "downvote") && (
        <ActionButton
          onClick={async () => handleFeedback("downvote", item.question_id)}
          className={clsx(feedback === "downvote" && "!text-medusa-fg-subtle")}
        >
          <ThumbDownIcon />
        </ActionButton>
      )}
    </div>
  )
}

const ActionButton = ({ children, className, ...props }: ButtonProps) => {
  return (
    <Button
      variant="transparent"
      className={clsx(
        "text-medusa-fg-muted hover:text-medusa-fg-subtle",
        "hover:bg-medusa-bg-subtle-hover",
        "p-docs_0.125 rounded-docs_sm",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  )
}
