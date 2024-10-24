import clsx from "clsx"
import React from "react"
import { ThreadType } from ".."
import { AiAssistantIcon, DotsLoading, MarkdownContent } from "@/components"
import { AiAssistantThreadItemActions } from "./Actions"

export type AiAssistantThreadItemProps = {
  item: ThreadType
}

export const AiAssistantThreadItem = ({ item }: AiAssistantThreadItemProps) => {
  return (
    <div
      className={clsx(
        "p-docs_0.5 flex gap-docs_0.75 items-start",
        item.type === "question" && "justify-end",
        item.type === "answer" && "!pr-[20px]"
      )}
    >
      {item.type !== "question" && (
        <span className="w-[20px] block">
          <AiAssistantIcon />
        </span>
      )}
      <div
        className={clsx(
          "txt-small text-medusa-fg-subtle",
          item.type === "question" && [
            "rounded-docs_xl bg-medusa-tag-neutral-bg",
            "px-docs_0.75 py-docs_0.5",
          ],
          item.type !== "question" && "flex-1",
          item.type === "answer" && "text-pretty flex-1"
        )}
      >
        {item.type === "question" && <>{item.content}</>}
        {item.type === "answer" && (
          <div className="flex flex-col gap-docs_0.75">
            {!item.question_id && item.content.length === 0 && <DotsLoading />}
            <MarkdownContent className="[&>*:last-child]:mb-0">
              {item.content}
            </MarkdownContent>
            {item.question_id && <AiAssistantThreadItemActions item={item} />}
          </div>
        )}
        {item.type === "error" && (
          <span className="text-medusa-fg-error">{item.content}</span>
        )}
      </div>
    </div>
  )
}
