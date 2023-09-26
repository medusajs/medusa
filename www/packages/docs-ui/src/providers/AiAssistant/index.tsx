import React, { createContext, useContext, useState } from "react"
import { useAnalytics } from "../Analytics"

export type AiAssistantContextType = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  getAnswer: (question: string, thread_id?: string) => Promise<Response>
  sendFeedback: (questionId: string, reaction: string) => Promise<Response>
}

const AiAssistantContext = createContext<AiAssistantContextType | null>(null)

export type AiAssistantProviderProps = {
  children?: React.ReactNode
  apiUrl: string
  apiToken: string
}

export const AiAssistantProvider = ({
  apiUrl,
  apiToken,
  children,
}: AiAssistantProviderProps) => {
  const [open, setOpen] = useState(false)
  const { analytics } = useAnalytics()

  const sendRequest = async (
    apiPath: string,
    method = "GET",
    headers?: HeadersInit,
    body?: BodyInit
  ) => {
    return await fetch(`${apiUrl}${apiPath}`, {
      method,
      headers: {
        "X-API-TOKEN": apiToken,
        ...headers,
      },
      body,
    })
  }

  const getAnswer = async (question: string, threadId?: string) => {
    const questionParam = encodeURI(question)
    return await sendRequest(
      threadId
        ? `/query/v1/thread/${threadId}/stream?query=${questionParam}`
        : `/query/v1/stream?query=${questionParam}`
    )
  }

  const sendFeedback = async (questionId: string, reaction: string) => {
    return await sendRequest(
      `/query/v1/question-answer/${questionId}/feedback`,
      "POST",
      {
        "Content-Type": "application/json",
      },
      JSON.stringify({
        question_id: questionId,
        reaction,
        user_identifier: analytics?.user().anonymousId() || "",
      })
    )
  }

  return (
    <AiAssistantContext.Provider
      value={{
        open,
        setOpen,
        getAnswer,
        sendFeedback,
      }}
    >
      {children}
    </AiAssistantContext.Provider>
  )
}

export const useAiAssistant = () => {
  const context = useContext(AiAssistantContext)

  if (!context) {
    throw new Error("useAiAssistant must be used within a AiAssistantProvider")
  }

  return context
}
