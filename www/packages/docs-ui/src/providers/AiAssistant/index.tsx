import React, { createContext, useContext, useState } from "react"

export type AiAssistantContextType = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  getAnswer: (question: string, thread_id?: string) => Promise<Response>
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

  // const sendRequest

  const getAnswer = async (question: string, thread_id?: string) => {
    const questionParam = encodeURI(question)
    const result = await fetch(
      thread_id
        ? `${apiUrl}/query/v1/thread/${thread_id}/stream?query=${questionParam}`
        : `${apiUrl}/query/v1/stream?query=${questionParam}`,
      {
        method: "GET",
        headers: {
          "X-API-TOKEN": apiToken,
        },
      }
    )

    return result
  }

  // const sendFeedback = () => {}

  return (
    <AiAssistantContext.Provider
      value={{
        open,
        setOpen,
        getAnswer,
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
