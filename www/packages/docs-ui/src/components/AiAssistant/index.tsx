"use client"

import React, { useState, useEffect, useCallback, useMemo, useRef } from "react"
import {
  Badge,
  Button,
  InputText,
  Kbd,
  SearchSuggestionItem,
  SearchSuggestionType,
  SearchHitGroupName,
  Tooltip,
  Link,
  AiAssistantIcon,
} from "@/components"
import { useAiAssistant, useSearch } from "@/providers"
import { ArrowUturnLeft, XMarkMini } from "@medusajs/icons"
import clsx from "clsx"
import { useSearchNavigation } from "@/hooks"
import { AiAssistantThreadItem } from "./ThreadItem"
import useResizeObserver from "@react-hook/resize-observer"

export type ChunkType = {
  stream_end: boolean
} & (
  | {
      type: "relevant_sources"
      content: {
        relevant_sources: RelevantSourcesType[]
      }
    }
  | {
      type: "partial_answer"
      content: PartialAnswerType
    }
  | {
      type: "identifiers"
      content: IdentifierType
    }
  | {
      type: "error"
      content: ErrorType
    }
)

export type RelevantSourcesType = {
  source_url: string
}

export type PartialAnswerType = {
  text: string
}

export type IdentifierType = {
  thread_id: string
  question_answer_id: string
}

export type ErrorType = {
  reason: string
}

export type ThreadType = {
  type: "question" | "answer" | "error"
  content: string
  question_id?: string
  // for some reason, items in the array get reordered
  // sometimes, so this is one way to avoid it
  order: number
}

export const AiAssistant = () => {
  const [question, setQuestion] = useState("")
  // this helps set the `order` field of the threadtype
  const [messagesCount, setMessagesCount] = useState(0)
  const [thread, setThread] = useState<ThreadType[]>([])
  const [answer, setAnswer] = useState("")
  const [identifiers, setIdentifiers] = useState<IdentifierType | null>(null)
  const [loading, setLoading] = useState(false)
  const { getAnswer } = useAiAssistant()
  const { setCommand } = useSearch()
  const inputRef = useRef<HTMLInputElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const suggestions: SearchSuggestionType[] = [
    {
      title: "FAQ",
      items: [
        "What is Medusa?",
        "How can I create an ecommerce store with Medusa?",
        "How can I build a marketplace with Medusa?",
        "How can I build subscription-based purchases with Medusa?",
        "How can I build digital products with Medusa?",
        "What can I build with Medusa?",
        "What is Medusa Admin?",
        "How do I configure the database in Medusa?",
      ],
    },
  ]

  const handleSubmit = (selectedQuestion?: string) => {
    if (!selectedQuestion?.length && !question.length) {
      return
    }
    setLoading(true)
    setAnswer("")
    setThread((prevThread) => [
      ...prevThread,
      {
        type: "question",
        content: selectedQuestion || question,
        order: getNewOrder(prevThread),
      },
    ])
    setMessagesCount((prev) => prev + 1)
  }

  useSearchNavigation({
    getInputElm: () => inputRef.current,
    focusInput: () => inputRef.current?.focus(),
    handleSubmit,
  })

  const sortThread = (threadArr: ThreadType[]) => {
    const sortedThread = [...threadArr]
    sortedThread.sort((itemA, itemB) => {
      if (itemA.order < itemB.order) {
        return -1
      }

      return itemA.order < itemB.order ? 1 : 0
    })
    return sortedThread
  }

  const getNewOrder = (prevThread: ThreadType[]) => {
    const sortedThread = sortThread(prevThread)

    return sortedThread.length === 0
      ? messagesCount + 1
      : sortedThread[prevThread.length - 1].order + 1
  }

  const setError = (logMessage?: string) => {
    if (logMessage?.length) {
      console.error(`[AI ERROR]: ${logMessage}`)
    }
    setThread((prevThread) => [
      ...prevThread,
      {
        type: "error",
        content:
          "I'm sorry, but I'm having trouble connecting to my knowledge base. Please try again. If the issue keeps persisting, please consider reporting an issue.",
        order: getNewOrder(prevThread),
      },
    ])
    setMessagesCount((prev) => prev + 1)
    setLoading(false)
    setQuestion("")
    setAnswer("")
    inputRef.current?.focus()
  }

  const scrollToBottom = () => {
    const parent = contentRef.current?.parentElement as HTMLElement

    parent.scrollTop = parent.scrollHeight
  }

  const lastAnswerIndex = useMemo(() => {
    const index = thread.reverse().findIndex((item) => item.type === "answer")
    return index !== -1 ? index : 0
  }, [thread])

  const process_stream = useCallback(async (response: Response) => {
    const reader = response.body?.getReader()
    if (!reader) {
      return
    }
    const decoder = new TextDecoder("utf-8")
    const delimiter = "\u241E"
    const delimiterBytes = new TextEncoder().encode(delimiter)
    let buffer = new Uint8Array()

    const findDelimiterIndex = (arr: Uint8Array) => {
      for (let i = 0; i < arr.length - delimiterBytes.length + 1; i++) {
        let found = true
        for (let j = 0; j < delimiterBytes.length; j++) {
          if (arr[i + j] !== delimiterBytes[j]) {
            found = false
            break
          }
        }
        if (found) {
          return i
        }
      }
      return -1
    }

    let result
    let loop = true
    while (loop) {
      result = await reader.read()
      if (result.done) {
        loop = false
        continue
      }
      buffer = new Uint8Array([...buffer, ...result.value])
      let delimiterIndex
      while ((delimiterIndex = findDelimiterIndex(buffer)) !== -1) {
        const chunkBytes = buffer.slice(0, delimiterIndex)
        const chunkText = decoder.decode(chunkBytes)
        buffer = buffer.slice(delimiterIndex + delimiterBytes.length)
        const chunk = JSON.parse(chunkText).chunk as ChunkType

        if (chunk.type === "partial_answer") {
          setAnswer((prevAnswer) => {
            return prevAnswer + chunk.content.text
          })
        } else if (chunk.type === "identifiers") {
          setIdentifiers(chunk.content)
        } else if (chunk.type === "error") {
          setError(chunk.content.reason)
          loop = false
          return
        }
      }
    }

    setLoading(false)
    setQuestion("")
  }, [])

  const fetchAnswer = useCallback(async () => {
    try {
      const response = await getAnswer(question, identifiers?.thread_id)

      if (response.status === 200) {
        await process_stream(response)
      } else {
        const message = await response.text()
        setError(message)
      }
    } catch (error: any) {
      setError(JSON.stringify(error))
    }
  }, [question, identifiers, process_stream])

  useEffect(() => {
    if (loading && !answer) {
      void fetchAnswer()
    }
  }, [loading, fetchAnswer])

  useEffect(() => {
    if (
      !loading &&
      answer.length &&
      thread[lastAnswerIndex]?.content !== answer
    ) {
      setThread((prevThread) => [
        ...prevThread,
        {
          type: "answer",
          content: answer,
          question_id: identifiers?.question_answer_id,
          order: getNewOrder(prevThread),
        },
      ])
      setAnswer("")
      setMessagesCount((prev) => prev + 1)
      inputRef.current?.focus()
    }
  }, [loading, answer, thread, lastAnswerIndex, inputRef.current])

  useResizeObserver(contentRef, () => {
    if (!loading) {
      return
    }

    scrollToBottom()
  })

  const getThreadItems = useCallback(() => {
    const sortedThread = sortThread(thread)

    return sortedThread.map((item, index) => (
      <AiAssistantThreadItem item={item} key={index} />
    ))
  }, [thread])

  return (
    <div className="h-full">
      <div
        className={clsx(
          "flex gap-docs_1 px-docs_1 py-docs_0.75",
          "h-[57px] w-full md:rounded-t-docs_xl relative border-0 border-solid",
          "border-b border-medusa-border-base relative"
        )}
      >
        <Button
          variant="transparent"
          onClick={() => setCommand(null)}
          className="text-medusa-fg-subtle p-[5px]"
        >
          <ArrowUturnLeft />
        </Button>
        <InputText
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className={clsx(
            "bg-transparent border-0 focus:outline-none hover:!bg-transparent",
            "shadow-none flex-1 text-medusa-fg-base",
            "disabled:!bg-transparent disabled:cursor-not-allowed"
          )}
          placeholder="Ask me a question about Medusa..."
          autoFocus={true}
          passedRef={inputRef}
          disabled={loading}
        />
        <Button
          variant="transparent"
          onClick={() => {
            setQuestion("")
            inputRef.current?.focus()
          }}
          className={clsx(
            "text-medusa-fg-subtle p-[5px]",
            "absolute top-docs_0.75 right-docs_1",
            "hover:bg-medusa-bg-base-hover rounded-docs_sm",
            question.length === 0 && "hidden"
          )}
        >
          <XMarkMini />
        </Button>
      </div>
      <div className="h-[calc(100%-120px)] md:h-[calc(100%-114px)] lg:max-h-[calc(100%-114px)] lg:min-h-[calc(100%-114px)] overflow-auto">
        <div ref={contentRef}>
          {!thread.length && (
            <div className="mx-docs_0.5">
              {suggestions.map((suggestion, index) => (
                <React.Fragment key={index}>
                  <SearchHitGroupName name={suggestion.title} />
                  {suggestion.items.map((item, itemIndex) => (
                    <SearchSuggestionItem
                      onClick={() => {
                        setQuestion(item)
                        handleSubmit(item)
                      }}
                      key={itemIndex}
                      tabIndex={itemIndex}
                    >
                      {item}
                    </SearchSuggestionItem>
                  ))}
                </React.Fragment>
              ))}
            </div>
          )}
          {getThreadItems()}
          {(answer.length || loading) && (
            <AiAssistantThreadItem
              item={{
                type: "answer",
                content: answer,
                order: 0,
              }}
            />
          )}
        </div>
      </div>
      <div
        className={clsx(
          "py-docs_0.75 flex items-center justify-between px-docs_1",
          "border-0 border-solid",
          "border-medusa-border-base border-t",
          "bg-medusa-bg-base h-[57px]"
        )}
      >
        <Tooltip
          tooltipChildren={
            <>
              This site is protected by reCAPTCHA and the{" "}
              <Link href="https://policies.google.com/privacy">
                Google Privacy Policy
              </Link>{" "}
              and <Link href="https://policies.google.com/terms">ToS</Link>{" "}
              apply
            </>
          }
        >
          <div
            className={clsx(
              "flex items-center gap-docs_0.75 text-compact-small-plus"
            )}
          >
            <AiAssistantIcon />
            <span className="text-medusa-fg-subtle">Medusa AI Assistant</span>
            <Badge variant="purple">Beta</Badge>
          </div>
        </Tooltip>
        <div className="hidden items-center gap-docs_1 md:flex">
          <div className="flex items-center gap-docs_0.5">
            {thread.length === 0 && (
              <>
                <span
                  className={clsx(
                    "text-medusa-fg-subtle",
                    "text-compact-x-small"
                  )}
                >
                  Navigate FAQ
                </span>
                <span className="gap-docs_0.25 flex">
                  <Kbd>↑</Kbd>
                  <Kbd>↓</Kbd>
                </span>
              </>
            )}
            {thread.length > 0 && (
              <span
                className={clsx("text-medusa-fg-muted", "text-compact-x-small")}
              >
                Chat is cleared on exit
              </span>
            )}
          </div>
          <div className="flex items-center gap-docs_0.5">
            <span
              className={clsx("text-medusa-fg-subtle", "text-compact-x-small")}
            >
              Ask Question
            </span>
            <Kbd>↵</Kbd>
          </div>
        </div>
      </div>
    </div>
  )
}
