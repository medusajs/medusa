import clsx from "clsx"
import React, { useMemo } from "react"
import { CodeMdx, CodeMdxProps } from "../../CodeMdx"
import { MarkdownContent } from "../../MarkdownContent"
import { MDXComponents } from "../../MDXComponents"
import { AiAssistantThreadItemActions } from "./Actions"
import { AiAssistantThreadItem as AiAssistantThreadItemType } from "../../../providers/AiAssistant"
import { useChat } from "@kapaai/react-sdk"
import { AiAssistantLoading } from "../Loading"

export type AiAssistantThreadItemProps = {
  item: AiAssistantThreadItemType
}

export const AiAssistantThreadItem = ({ item }: AiAssistantThreadItemProps) => {
  const { error } = useChat()
  const showLoading = useMemo(() => {
    if (error?.length) {
      return false
    }

    return !item.question_id && item.content.length === 0
  }, [item, error])
  if (
    item.isGenerationAborted &&
    item.type === "answer" &&
    !item.content.length
  ) {
    return null
  }
  return (
    <div
      className={clsx(
        "p-docs_0.5 flex gap-docs_0.75 items-start",
        item.type === "question" && "justify-end",
        item.type === "answer" && "!pr-[20px]"
      )}
    >
      <div
        className={clsx(
          "txt-small text-medusa-fg-base",
          "flex flex-col gap-docs_0.75",
          item.type !== "question" && "flex-1",
          item.type === "answer" && "text-pretty flex-1 max-w-[calc(100%-20px)]"
        )}
      >
        <div
          className={clsx(
            "flex flex-col gap-docs_0.75",
            item.type === "question" && [
              "rounded-docs_xl bg-medusa-tag-neutral-bg",
              "px-docs_0.75 py-docs_0.5 max-w-full md:max-w-[400px]",
            ]
          )}
        >
          {item.type === "question" && (
            <MarkdownContent
              className="[&>*:last-child]:mb-0"
              allowedElements={["br", "p", "code", "pre"]}
              unwrapDisallowed={true}
              components={{
                ...MDXComponents,
                code: (props: CodeMdxProps) => {
                  return (
                    <CodeMdx
                      {...props}
                      noCopy
                      noReport
                      forceNoTitle
                      noAskAi
                      inlineCodeProps={{
                        ...props.inlineCodeProps,
                        className: "!text-wrap !break-words",
                        variant: "grey-bg",
                      }}
                      collapsibleLines="11"
                      codeBlockProps={{
                        className: clsx(
                          "rounded-docs_lg p-[5px]",
                          props.className
                        ),
                        wrapperClassName: "rounded-docs_lg",
                        innerClassName: "border rounded-docs_lg",
                        overrideColors: {
                          bg: "bg-medusa-contrast-bg-subtle",
                          innerBg: "bg-medusa-contrast-bg-subtle",
                          innerBorder: "border-medusa-contrast-border-bot",
                        },
                      }}
                    />
                  )
                },
              }}
            >
              {item.content}
            </MarkdownContent>
          )}
          {item.type === "answer" && (
            <>
              {showLoading && <AiAssistantLoading />}
              <MarkdownContent
                className="[&>*:last-child]:mb-0"
                components={{
                  ...MDXComponents,
                  code: (props: CodeMdxProps) => {
                    return (
                      <CodeMdx
                        {...props}
                        noReport
                        noAskAi
                        wrapperClassName="mt-docs_1"
                      />
                    )
                  },
                }}
                disallowedElements={["h1", "h2", "h3", "h4", "h5", "h6"]}
              >
                {item.content}
              </MarkdownContent>
            </>
          )}
        </div>
        {(item.question_id || item.type === "question") && (
          <AiAssistantThreadItemActions item={item} />
        )}
        {item.type === "error" && (
          <span className="text-medusa-fg-error">{item.content}</span>
        )}
      </div>
    </div>
  )
}
