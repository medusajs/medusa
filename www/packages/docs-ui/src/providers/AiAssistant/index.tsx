"use client"

import { KapaProvider, useChat, useDeepThinking } from "@kapaai/react-sdk"
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import type { Source } from "@kapaai/react-sdk"
import useResizeObserver from "@react-hook/resize-observer"
import { AiAssistantSearchWindow } from "../../components/AiAssistant/SearchWindow"
import { useIsBrowser } from "../BrowserProvider"

export type AiAssistantChatType = "default" | "popover"

export type AiAssistantSuggestionType = {
  title: string
  items: string[]
}

const defaultSuggestions: AiAssistantSuggestionType[] = [
  {
    title: "FAQ",
    items: [
      "What is Medusa?",
      "How can I create a module?",
      "How can I create a data model?",
      "How do I create a workflow?",
      "How can I extend a data model in the Product Module?",
    ],
  },
  {
    title: "Recipes",
    items: [
      "How do I build a marketplace with Medusa?",
      "How do I build digital products with Medusa?",
      "How do I build subscription-based purchases with Medusa?",
      "What other recipes are available in the Medusa documentation?",
    ],
  },
]

export type AiAssistantContextType = {
  chatOpened: boolean
  setChatOpened: React.Dispatch<React.SetStateAction<boolean>>
  chatType: AiAssistantChatType
  inputRef: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>
  contentRef: React.RefObject<HTMLDivElement | null>
  loading: boolean
  isCaptchaLoaded: boolean
  submitQuery: (q: string) => void
  deepThinkingEnabled: boolean
  toggleDeepThinking: () => void
  suggestions: AiAssistantSuggestionType[]
  hideAiToolsMessage?: boolean
}

export type AiAssistantThreadItem = {
  type: "question" | "answer" | "error"
  content: string
  question_id?: string | null
  sources?: Source[]
  isGenerationAborted?: boolean
}

const AiAssistantContext = createContext<AiAssistantContextType | null>(null)

export type AiAssistantProviderProps = {
  children?: React.ReactNode
  integrationId: string
  groupIds?: string[]
  chatType?: AiAssistantChatType
  type?: "search" | "chat"
  suggestions?: AiAssistantSuggestionType[]
  hideAiToolsMessage?: boolean
}

type AiAssistantInnerProviderProps = Omit<
  AiAssistantProviderProps,
  "integrationId"
> & {
  preventAutoScroll: boolean
  setPreventAutoScroll: React.Dispatch<React.SetStateAction<boolean>>
  setOnCompleteAction: React.Dispatch<React.SetStateAction<() => void>>
}

const AiAssistantInnerProvider = ({
  children,
  chatType = "default",
  preventAutoScroll,
  setPreventAutoScroll,
  setOnCompleteAction,
  type,
  suggestions = defaultSuggestions,
  hideAiToolsMessage = false,
}: AiAssistantInnerProviderProps) => {
  const [isCaptchaLoaded, setIsCaptchaLoaded] = useState(false)
  const [chatOpened, setChatOpened] = useState(false)
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const { isGeneratingAnswer, isPreparingAnswer, submitQuery } = useChat()
  const { active: deepThinkingEnabled, toggle: toggleDeepThinking } =
    useDeepThinking()
  const loading = useMemo(
    () => isGeneratingAnswer || isPreparingAnswer,
    [isGeneratingAnswer, isPreparingAnswer]
  )
  const { isBrowser } = useIsBrowser()

  const scrollToBottom = () => {
    if (preventAutoScroll) {
      return
    }
    const parent = contentRef.current?.parentElement as HTMLElement

    if (!parent) {
      return
    }

    parent.scrollTop = parent.scrollHeight
  }

  useResizeObserver(contentRef as React.RefObject<HTMLDivElement>, () => {
    if (!loading) {
      return
    }

    scrollToBottom()
  })

  const handleUserScroll = useCallback(() => {
    if (!loading || preventAutoScroll) {
      return
    }

    setPreventAutoScroll(true)
  }, [loading, preventAutoScroll])

  useEffect(() => {
    if (!contentRef.current?.parentElement) {
      return
    }

    contentRef.current.parentElement.addEventListener(
      "wheel",
      handleUserScroll,
      {
        passive: true,
      }
    )
    contentRef.current.parentElement.addEventListener(
      "touchmove",
      handleUserScroll,
      {
        passive: true,
      }
    )

    return () => {
      contentRef.current?.parentElement?.removeEventListener(
        "wheel",
        handleUserScroll
      )
      contentRef.current?.parentElement?.removeEventListener(
        "touchmove",
        handleUserScroll
      )
    }
  }, [contentRef.current, handleUserScroll])

  useEffect(() => {
    setOnCompleteAction(() => {
      scrollToBottom()
      if (chatOpened) {
        inputRef.current?.focus({
          preventScroll: true,
        })
      }
    })
  }, [scrollToBottom])

  /**
   * This effect is required to avoid recaptcha messing up
   * the page layout.
   */
  useEffect(() => {
    if (!isBrowser) {
      return
    }

    const recaptchaElm = document.querySelector(".grecaptcha-badge")
    recaptchaElm?.parentElement?.classList.add("absolute")
    const maxRetry = 10
    let retries = 0
    const interval = setInterval(() => {
      if (window.grecaptcha) {
        setIsCaptchaLoaded(true)
        clearInterval(interval)
        return
      }
      retries++
      if (retries > maxRetry) {
        clearInterval(interval)
      }
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [isBrowser])

  return (
    <AiAssistantContext.Provider
      value={{
        chatOpened,
        setChatOpened,
        chatType,
        inputRef,
        contentRef,
        loading,
        isCaptchaLoaded,
        submitQuery,
        deepThinkingEnabled,
        toggleDeepThinking,
        suggestions,
        hideAiToolsMessage,
      }}
    >
      {children}
      {type === "search" && <AiAssistantSearchWindow />}
    </AiAssistantContext.Provider>
  )
}

export const AiAssistantProvider = ({
  integrationId,
  groupIds,
  ...props
}: AiAssistantProviderProps) => {
  const [preventAutoScroll, setPreventAutoScroll] = useState(false)
  const [onCompleteAction, setOnCompleteAction] = useState<() => void>(
    () => () => {}
  )

  return (
    <KapaProvider
      integrationId={integrationId}
      sourceGroupIDsInclude={groupIds}
      callbacks={{
        askAI: {
          onAnswerGenerationCompleted: () => {
            onCompleteAction?.()
          },
          onQuerySubmit: () => setPreventAutoScroll(false),
        },
      }}
      userTrackingMode="cookie"
    >
      <AiAssistantInnerProvider
        {...props}
        preventAutoScroll={preventAutoScroll}
        setPreventAutoScroll={setPreventAutoScroll}
        setOnCompleteAction={setOnCompleteAction}
      />
    </KapaProvider>
  )
}

export const useAiAssistant = () => {
  const context = useContext(AiAssistantContext)

  if (!context) {
    throw new Error("useAiAssistant must be used within a AiAssistantProvider")
  }

  return context
}
