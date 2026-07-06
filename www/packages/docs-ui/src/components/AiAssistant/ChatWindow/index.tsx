"use client"

import clsx from "clsx"
import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react"
import { useAiAssistant } from "../../../providers/AiAssistant"
import { useIsBrowser } from "../../../providers/BrowserProvider"
import { AiAssistantChatWindowHeader } from "./Header"
import { AiAssistantSuggestions } from "../Suggestions"
import { AiAssistantThreadItem } from "../ThreadItem"
import { AiAssistantChatWindowInput } from "./Input"
import { useKeyboardShortcut } from "../../../hooks/use-keyboard-shortcut"
import { AiAssistantChatWindowFooter } from "./Footer"
import { useChat } from "@kapaai/react-sdk"
import { AiAssistantChatWindowCallout } from "./Callout"

const DEFAULT_HEIGHT = "calc(100% - 8px)"

export const AiAssistantChatWindow = () => {
  const {
    chatOpened,
    setChatOpened,
    chatType: type,
    inputRef,
    contentRef,
    loading,
  } = useAiAssistant()
  const { conversation, error } = useChat()
  const [height, setHeight] = useState(DEFAULT_HEIGHT)
  const [showFade, setShowFade] = useState(false)
  const { isBrowser } = useIsBrowser()
  const chatWindowRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (chatOpened) {
      inputRef.current?.focus({
        preventScroll: true,
      })
    } else {
      inputRef.current?.blur()
    }
  }, [chatOpened])

  const getThreadItems = useCallback(() => {
    return conversation.map((item, index) => (
      <Fragment key={index}>
        <AiAssistantThreadItem
          item={{
            type: "question",
            content: item.question,
            sources: item.sources,
            question_id: item.id,
            isGenerationAborted: item.isGenerationAborted,
          }}
        />
        <AiAssistantThreadItem
          item={{
            type: "answer",
            content: item.answer,
            sources: item.sources,
            question_id: item.id,
            isGenerationAborted: item.isGenerationAborted,
          }}
        />
      </Fragment>
    ))
  }, [conversation])

  useKeyboardShortcut({
    metakey: false,
    shortcutKeys: ["escape"],
    checkEditing: false,
    action: () => {
      if (!chatWindowRef.current?.contains(document.activeElement)) {
        return
      }

      setChatOpened(false)
    },
  })

  const checkShowFade = () => {
    const parentElm = contentRef.current?.parentElement
    if (!parentElm) {
      return
    }
    setShowFade(
      !loading &&
        parentElm.offsetHeight + parentElm.scrollTop <
          parentElm.scrollHeight - 1
    )
  }

  useEffect(() => {
    if (!contentRef.current?.parentElement) {
      return
    }
    contentRef.current.parentElement.addEventListener("scroll", checkShowFade)

    return () => {
      contentRef.current?.parentElement?.removeEventListener(
        "scroll",
        checkShowFade
      )
    }
  }, [contentRef.current])

  useEffect(() => {
    if (loading) {
      setShowFade(false)
    } else {
      checkShowFade()
    }
  }, [loading])

  const changeHeightForViewport = () => {
    if (!window.visualViewport?.height) {
      setHeight(DEFAULT_HEIGHT)
      return
    }

    setHeight(`${window.visualViewport.height - 8}px`)
  }

  useEffect(() => {
    if (!isBrowser) {
      return
    }

    window.visualViewport?.addEventListener("resize", changeHeightForViewport)

    return () => {
      window.visualViewport?.removeEventListener(
        "resize",
        changeHeightForViewport
      )
    }
  }, [isBrowser])

  useEffect(() => {
    checkShowFade()
  }, [height])

  return (
    <>
      <div
        className={clsx(
          "fixed top-0 left-0 h-screen w-screen z-50 bg-medusa-bg-overlay",
          !chatOpened && "hidden",
          chatOpened && "block",
          type === "default" && "xxl:hidden"
        )}
        onClick={() => setChatOpened(false)}
      />
      <div
        className={clsx(
          "flex z-50 w-[calc(100%-8px)] md:w-ai-assistant transition-[right]",
          "absolute -right-[150%] sm:-right-full top-0",
          type === "default" && [
            "xxl:w-0 xxl:relative xxl:transition-[right,width]",
            "xxl:shadow-elevation-card-rest xxl:dark:shadow-elevation-card-rest-dark",
            chatOpened && "xxl:!w-ai-assistant",
          ],
          "shadow-elevation-modal dark:shadow-elevation-modal-dark",
          "bg-medusa-bg-base rounded-docs_DEFAULT overflow-x-hidden",
          "flex-col justify-between m-docs_0.25 max-w-ai-assistant",
          chatOpened && ["!right-0"],
          !chatOpened && ["!fixed"]
        )}
        style={{
          height,
        }}
        ref={chatWindowRef}
      >
        <AiAssistantChatWindowHeader />
        <div className="flex flex-col flex-auto overflow-auto relative">
          <div
            className={clsx(
              "overflow-y-auto flex-auto px-docs_0.5 py-docs_1.5 relative"
            )}
          >
            <div ref={contentRef} className="flex flex-col gap-docs_2">
              {!conversation.length && <AiAssistantSuggestions />}
              {getThreadItems()}
              {error?.length && (
                <AiAssistantThreadItem
                  item={{
                    type: "error",
                    content: error,
                  }}
                />
              )}
            </div>
            <div className="sticky bottom-0 z-[11]">
              <AiAssistantChatWindowCallout />
            </div>
          </div>
          <span
            className={clsx(
              "bg-ai-assistant-bottom content-[''] absolute pointer-events-none",
              "bottom-0 left-0 w-full h-docs_6 z-10 opacity-0 transition-opacity",
              showFade && "opacity-100"
            )}
          ></span>
        </div>
        <AiAssistantChatWindowInput chatWindowRef={chatWindowRef} />
        <AiAssistantChatWindowFooter />
      </div>
    </>
  )
}
