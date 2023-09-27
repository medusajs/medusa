"use client"

import React, { useState, useEffect, useCallback } from "react"
import { Badge, Button, InputText, MarkdownContent, Modal } from "@/components"
import { useAiAssistant } from "@/providers"
import { ArrowUpCircleSolid, Sparkles, XMark } from "@medusajs/icons"
import clsx from "clsx"
import { useKeyboardShortcut } from "../../hooks"
import { CSSTransition } from "react-transition-group"
import { Drawer } from "@medusajs/ui"

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

export const AiAssistant = () => {
  const [question, setQuestion] = useState("")
  const [relevantSources, setRelevantSources] = useState<RelevantSourcesType[]>(
    []
  )
  const [answer, setAnswer] = useState("")
  const [identifiers, setIdentifiers] = useState<IdentifierType | null>(null)
  const [error, setError] = useState<ErrorType | null>(null)
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState("")
  const { open, setOpen, getAnswer, sendFeedback } = useAiAssistant()

  const process_stream = async (response: Response) => {
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

        if (chunk.type === "relevant_sources") {
          setRelevantSources(chunk.content.relevant_sources)
        } else if (chunk.type === "partial_answer") {
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
  }

  const handleSubmit = () => {
    setLoading(true)
    setAnswer("")
    setRelevantSources([])
  }

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
  }, [question, identifiers])

  const handleFeedback = async (question_id: string, reaction: string) => {
    try {
      const response = await sendFeedback(question_id, reaction)

      if (response.status === 200) {
        setFeedback(reaction)
      } else {
        setError({
          reason:
            "There was an error in submitting your feedback. Please refresh the page and try again.",
        })
        console.error("Error sending feedback:", response.status)
      }
    } catch (error) {
      setError({
        reason:
          "There was an error in submitting your feedback. Please refresh the page and try again.",
      })
      console.error("Error sending feedback:", error)
    }
  }

  useEffect(() => {
    if (loading && question && !answer) {
      void fetchAnswer()
    }
  }, [loading, question, answer, fetchAnswer])

  useKeyboardShortcut({
    shortcutKeys: ["Escape"],
    checkEditing: true,
    preventDefault: false,
    isLoading: false,
    action: () => setOpen(false),
  })

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <Drawer.Content>
        <Drawer.Header>
          <Drawer.Title>
            <div className={clsx("flex gap-docs_0.75 items-center")}>
              <span className="p-[6px] bg-medusa-button-inverted bg-button-inverted dark:bg-button-inverted-dark rounded-docs_DEFAULT">
                <Sparkles className="text-medusa-fg-on-color" />
              </span>
              <span>Medusa AI Assistant</span>
              <Badge variant="purple">Beta</Badge>
            </div>
          </Drawer.Title>
        </Drawer.Header>
        <Drawer.Body>
          <div className="flex gap-docs_1 px-docs_1 py-docs_0.75">
            <InputText
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className={clsx(
                "bg-transparent border-0 focus:outline-none hover:!bg-transparent",
                "shadow-none flex-1"
              )}
              placeholder="Ask me a question about Medusa..."
            />
            <Button
              variant="clear"
              onClick={handleSubmit}
              disabled={loading || !question}
              className="text-medusa-fg-base disabled:text-medusa-fg-disabled rounded-full p-[5px]"
            >
              <ArrowUpCircleSolid />
            </Button>
          </div>
          <CSSTransition
            classNames={{
              enter: "animate-fadeInDown animate-fast",
              exit: "animate-fadeOutUp animate-fast",
            }}
            timeout={300}
            in={answer.length > 0 || error !== null}
            unmountOnExit
          >
            <div className="px-docs_1 py-docs_0.75 h-[332px] max-h-[332px] overflow-auto">
              {error && (
                <span className="text-medusa-fg-error">
                  An error occurred, please try again later.
                </span>
              )}
              {answer && (
                <p>
                  <MarkdownContent>{answer}</MarkdownContent>
                </p>
              )}
              {!loading && relevantSources.length > 0 && (
                <>
                  <strong>Find more details in these resources</strong>
                  <ul>
                    {relevantSources.map((source, index) => (
                      <li key={index}>
                        <a
                          href={source.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {source.source_url}
                        </a>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </CSSTransition>
        </Drawer.Body>
      </Drawer.Content>
    </Drawer>
  )
}
