"use client"

import React, { useState, useEffect, useCallback, useMemo, useRef } from "react"
import {
  AiAssistantCommandIcon,
  Badge,
  Button,
  InputText,
  Kbd,
  SearchSuggestionItem,
  SearchSuggestionType,
  SearchHitGroupName,
} from "@/components"
import { useAiAssistant, useSearch } from "@/providers"
import { ArrowUturnLeft } from "@medusajs/icons"
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
  type: "question" | "answer"
  content: string
  question_id?: string
}

export const AiAssistant = () => {
  const [question, setQuestion] = useState("")
  const [thread, setThread] = useState<ThreadType[]>([])
  const [answer, setAnswer] = useState("")
  const [identifiers, setIdentifiers] = useState<IdentifierType | null>(null)
  const [error, setError] = useState<ErrorType | null>(null)
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
        "How do I install Medusa?",
        "What is Medusa admin?",
        "How do I configure the database in Medusa?",
        "How do I seed data in Medusa",
        "How do I create an endpoint in Medusa?",
      ],
    },
  ]

  const handleSubmit = (selectedQuestion?: string) => {
    setLoading(true)
    setAnswer("")
    setThread((prevThread) => [
      ...prevThread,
      {
        type: "question",
        content: selectedQuestion || question,
      },
    ])
  }

  useSearchNavigation({
    getInputElm: () => inputRef.current,
    focusInput: () => inputRef.current?.focus(),
    handleSubmit,
  })

  const scrollToBottom = () => {
    const parent = contentRef.current?.parentElement as HTMLElement

    parent.scrollTop = parent.scrollHeight
  }

  const lastAnswerIndex = useMemo(() => {
    const index = thread.reverse().findIndex((item) => item.type === "answer")
    return index !== -1 ? index : 0
  }, [thread])

  const process_stream = useCallback(
    async (response: Response) => {
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
            setAnswer((prevAnswer) => prevAnswer + chunk.content.text)
          } else if (chunk.type === "identifiers") {
            setIdentifiers(chunk.content)
          } else if (chunk.type === "error") {
            setError(chunk.content)
            loop = false
            break
          }
        }
      }

      setLoading(false)
      setQuestion("")
      inputRef.current?.focus()
    },
    [thread]
  )

  const fetchAnswer = useCallback(async () => {
    try {
      const response = await getAnswer(question, identifiers?.thread_id)

      if (response.status === 200) {
        await process_stream(response)
      } else {
        const message = await response.text()
        console.error("Error fetching data:", message)
        setError({
          reason: `Request failed with status code ${response.status}. Message: ${message}`,
        })
      }
    } catch (error: any) {
      console.error("Error fetching thread data:", error)
      setError({
        reason: `Thread request failed: ${error.message}`,
      })
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
        },
      ])
      setAnswer("")
    }
  }, [loading])

  useResizeObserver(contentRef, () => {
    if (!loading) {
      return
    }

    scrollToBottom()
  })

  return (
    <div className="h-full">
      <div
        className={clsx(
          "flex gap-docs_1 px-docs_1 py-docs_0.75",
          "h-[57px] w-full md:rounded-t-docs_xl relative border-0 border-solid",
          "border-b border-medusa-border-base"
        )}
      >
        <Button
          variant="clear"
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
            "shadow-none flex-1 text-medusa-fg-base"
          )}
          placeholder="Ask me a question about Medusa..."
          autoFocus={true}
          passedRef={inputRef}
        />
      </div>
      <div className="h-[calc(100%-120px)] md:h-[calc(100%-114px)] lg:max-h-[calc(100%-114px)] lg:min-h-[calc(100%-114px)] overflow-auto">
        <div ref={contentRef}>
          {error && (
            <span className="text-medusa-fg-error">
              An error occurred, please try again later.
            </span>
          )}
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
          {thread.map((threadItem, index) => (
            <AiAssistantThreadItem item={threadItem} key={index} />
          ))}
          {(answer.length || loading) && (
            <AiAssistantThreadItem
              item={{
                type: "answer",
                content: answer,
              }}
              isCurrentAnswer={true}
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
        <div
          className={clsx(
            "flex items-center gap-docs_0.75 text-compact-small-plus"
          )}
        >
          <AiAssistantCommandIcon />
          <span className="text-medusa-fg-subtle">Medusa AI Assistant</span>
          <Badge variant="purple">Beta</Badge>
        </div>
        <div className="hidden items-center gap-docs_1 md:flex">
          <div className="flex items-center gap-docs_0.5">
            <span
              className={clsx("text-medusa-fg-subtle", "text-compact-x-small")}
            >
              Navigate FAQ
            </span>
            <span className="gap-docs_0.25 flex">
              <Kbd>↑</Kbd>
              <Kbd>↓</Kbd>
            </span>
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
