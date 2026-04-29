import React, { useState } from "react"
import clsx from "clsx"
import { Button, type ButtonProps } from "@/components/Button"
import {
  ThumbDown,
  ThumbUp,
  Link as LinkIcon,
  CheckCircle,
  SquareTwoStack,
} from "@medusajs/icons"
import { useSiteConfig } from "../../../../providers/SiteConfig"
import { AiAssistantThreadItem as AiAssistantThreadItemType } from "../../../../providers/AiAssistant"
import { Reaction, useChat } from "@kapaai/react-sdk"
import { useCopy } from "../../../../hooks/use-copy"
import Link from "next/link"

export type AiAssistantThreadItemActionsProps = {
  item: AiAssistantThreadItemType
}

export const AiAssistantThreadItemActions = ({
  item,
}: AiAssistantThreadItemActionsProps) => {
  const [feedback, setFeedback] = useState<Reaction | null>(null)
  const { addFeedback } = useChat()
  const {
    config: { baseUrl },
  } = useSiteConfig()
  const { handleCopy: handleLinkCopy, isCopied: isLinkCopied } = useCopy(
    `${baseUrl}?query=${encodeURI(item.content)}`
  )
  const { handleCopy: handleAnswerCopy, isCopied: isAnswerCopied } = useCopy(
    item.content
  )

  const handleFeedback = async (
    reaction: Reaction,
    question_id?: string | null
  ) => {
    try {
      if (!question_id || feedback) {
        return
      }
      setFeedback(reaction)
      addFeedback(question_id, reaction)
    } catch (error) {
      console.error("Error sending feedback:", error)
    }
  }

  return (
    <div
      className={clsx(
        "flex gap-docs_0.75 items-center",
        item.type === "question" && "justify-end",
        item.type === "answer" && "justify-between"
      )}
    >
      {item.type === "question" && (
        <div className="flex gap-docs_0.25 items-center text-medusa-fg-muted">
          <ActionButton onClick={handleLinkCopy} data-testid="link-copy-button">
            {isLinkCopied ? <CheckCircle /> : <LinkIcon />}
          </ActionButton>
        </div>
      )}
      {item.type === "answer" && (
        <>
          {item.sources !== undefined && item.sources.length > 0 && (
            <div className="flex gap-[6px] items-center flex-wrap">
              {item.sources.map((source, index) => (
                <Link
                  key={index}
                  href={source.source_url}
                  className={clsx(
                    "flex items-center justify-center px-[6px] py-px",
                    "rounded-docs_xs bg-medusa-tag-neutral-bg font-monospace",
                    "text-medusa-fg-subtle hover:text-medusa-fg-base",
                    "text-code-paragraph-2xsmall"
                  )}
                >
                  {source.title}
                </Link>
              ))}
            </div>
          )}
          <div className="flex gap-docs_0.25 items-center text-medusa-fg-muted">
            <ActionButton
              onClick={handleAnswerCopy}
              data-testid="answer-copy-button"
            >
              {isAnswerCopied ? <CheckCircle /> : <SquareTwoStack />}
            </ActionButton>
            {(feedback === null || feedback === "upvote") && (
              <ActionButton
                onClick={async () => handleFeedback("upvote", item.question_id)}
                data-testid="upvote-button"
                className={clsx(
                  feedback === "upvote" && "!text-medusa-fg-muted"
                )}
              >
                <ThumbUp />
              </ActionButton>
            )}
            {(feedback === null || feedback === "downvote") && (
              <ActionButton
                onClick={async () =>
                  handleFeedback("downvote", item.question_id)
                }
                data-testid="downvote-button"
                className={clsx(
                  feedback === "downvote" && "!text-medusa-fg-muted"
                )}
              >
                <ThumbDown />
              </ActionButton>
            )}
          </div>
        </>
      )}
    </div>
  )
}

const ActionButton = ({ children, className, ...props }: ButtonProps) => {
  return (
    <Button
      variant="transparent"
      className={clsx(
        "text-medusa-fg-muted hover:text-medusa-fg-muted",
        "hover:bg-medusa-bg-subtle-hover",
        "!p-[4.5px] rounded-docs_sm",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  )
}
