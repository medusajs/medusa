import React, { useState, useEffect, useCallback } from "react"
import { Button, InputText, Modal } from "@/components"
import { useAiAssistant } from "../../providers/AiAssistant"

export type ChunkType = {
  stream_end: boolean
} & (
  | {
      type: "relevant_sources"
      content: RelevantSourcesType[]
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
          setRelevantSources(chunk.content)
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

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <div>
        {error ? (
          <div>
            <h2>Error:</h2>
            <p>{error}</p>
          </div>
        ) : (
          <>
            <InputText
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <Button
              onClick={handleSubmit}
              disabled={!question.length || loading}
            >
              Submit
            </Button>
            <h2>Relevant Sources:</h2>
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
            <h2>Answer:</h2>
            <p>{answer}</p>
            {identifiers && (
              <div>
                <h2>
                  Identifiers (for demo purposes only, not to be displayed
                  normally):
                </h2>
                <p>Thread ID: {identifiers.thread_id}</p>
                <p>Question Answer ID: {identifiers.question_answer_id}</p>
                <h3>Submit your feedback:</h3>
                <button
                  onClick={async () =>
                    handleFeedback(identifiers.question_answer_id, "upvote")
                  }
                >
                  Upvote
                </button>
                <button
                  onClick={async () =>
                    handleFeedback(identifiers.question_answer_id, "downvote")
                  }
                >
                  Downvote
                </button>
                {feedback && <p>Your feedback: {feedback}</p>}
              </div>
            )}
          </>
        )}
      </div>
    </Modal>
  )
}
