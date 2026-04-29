import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { fireEvent, render } from "@testing-library/react"
import * as AiAssistantMocks from "../../__mocks__"
import { AiAssistantThreadItemProps } from "../../ThreadItem"

// Mock components and hooks
vi.mock("@/providers/AiAssistant", () => ({
  useAiAssistant: () => AiAssistantMocks.mockUseAiAssistant(),
}))
vi.mock("@/providers/Analytics", () => ({
  useAnalytics: () => ({
    track: AiAssistantMocks.mockTrack,
  }),
}))
vi.mock("@/providers/BrowserProvider", () => ({
  useIsBrowser: () => ({
    isBrowser: true,
  }),
}))
vi.mock("@/hooks/use-ai-assistant-chat-navigation", () => ({
  useAiAssistantChatNavigation: () => ({
    getChatWindowElm: AiAssistantMocks.mockGetChatWindowElm,
    getInputElm: AiAssistantMocks.mockGetInputElm,
    focusInput: AiAssistantMocks.mockFocusInput,
    question: "",
  }),
}))
vi.mock("@kapaai/react-sdk", () => ({
  useChat: () => AiAssistantMocks.mockUseChat(),
  useDeepThinking: () => AiAssistantMocks.mockUseDeepThinking(),
}))
vi.mock("@/components/Tooltip", () => ({
  Tooltip: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}))
vi.mock("@/components/AiAssistant/ChatWindow/Header", () => ({
  AiAssistantChatWindowHeader: () => <div>Header</div>,
}))
vi.mock("@/components/AiAssistant/ChatWindow/Input", () => ({
  AiAssistantChatWindowInput: () => <div>Input</div>,
}))
vi.mock("@/components/AiAssistant/ChatWindow/Footer", () => ({
  AiAssistantChatWindowFooter: () => <div>Footer</div>,
}))
vi.mock("@/components/AiAssistant/Suggestions", () => ({
  AiAssistantSuggestions: () => <div>Suggestions</div>,
}))
vi.mock("@/components/AiAssistant/ThreadItem", () => ({
  AiAssistantThreadItem: ({ item }: AiAssistantThreadItemProps) => (
    <div className="thread-item">ThreadItem - type: {item.type}</div>
  ),
}))
vi.mock("@/components/AiAssistant/ChatWindow/Callout", () => ({
  AiAssistantChatWindowCallout: () => <div data-testid="callout">Callout</div>,
}))

import { AiAssistantChatWindow } from "../../ChatWindow"

// Reset mock before each test to ensure clean state
beforeEach(() => {
  AiAssistantMocks.mockUseAiAssistant.mockReturnValue(
    AiAssistantMocks.defaultUseAiAssistantReturn
  )
  AiAssistantMocks.mockSetChatOpened.mockClear()
  AiAssistantMocks.mockTrack.mockClear()
  AiAssistantMocks.mockAddFeedback.mockClear()
  AiAssistantMocks.mockSubmitQuery.mockClear()
  AiAssistantMocks.mockStopGeneration.mockClear()
  AiAssistantMocks.mockConversation.length = 1
  AiAssistantMocks.mockUseChat.mockReturnValue(
    AiAssistantMocks.defaultUseChatReturn
  )
  AiAssistantMocks.mockUseDeepThinking.mockReturnValue(
    AiAssistantMocks.defaultUseDeepThinkingReturn
  )
})

describe("rendering", () => {
  test("renders chat window", () => {
    const { container } = render(<AiAssistantChatWindow />)
    expect(container).toBeInTheDocument()
    expect(container).toHaveTextContent("Header")
    expect(container).toHaveTextContent("Input")
    expect(container).toHaveTextContent("Footer")
    expect(container).toHaveTextContent("Callout")
  })

  test("chat is hidden when chatOpened is false", () => {
    AiAssistantMocks.mockUseAiAssistant.mockReturnValueOnce({
      ...AiAssistantMocks.defaultUseAiAssistantReturn,
      chatOpened: false,
    })
    const { container } = render(<AiAssistantChatWindow />)
    expect(container).toBeInTheDocument()
    const overlay = container.querySelector(".bg-medusa-bg-overlay")
    expect(overlay).toBeInTheDocument()
    expect(overlay).toHaveClass("hidden")
    const chatWindow = container.querySelector(".z-50.flex")
    expect(chatWindow).toBeInTheDocument()
    expect(chatWindow).toHaveClass("!fixed")
  })

  test("chat is shown when chatOpened is true", () => {
    AiAssistantMocks.mockUseAiAssistant.mockReturnValueOnce({
      ...AiAssistantMocks.defaultUseAiAssistantReturn,
      chatOpened: true,
    })
    const { container } = render(<AiAssistantChatWindow />)
    expect(container).toBeInTheDocument()
    const overlay = container.querySelector(".bg-medusa-bg-overlay")
    expect(overlay).toBeInTheDocument()
    expect(overlay).toHaveClass("block")
    const chatWindow = container.querySelector(".z-50.flex")
    expect(chatWindow).toBeInTheDocument()
    expect(chatWindow).toHaveClass("!right-0")
  })
})

describe("conversation", () => {
  test("show suggestions when conversation is empty", () => {
    AiAssistantMocks.mockConversation.length = 0
    const { container } = render(<AiAssistantChatWindow />)
    expect(container).toBeInTheDocument()
    expect(container).toHaveTextContent("Suggestions")
  })

  test("show thread items when conversation is not empty", () => {
    AiAssistantMocks.mockConversation.length = 2
    const { container } = render(<AiAssistantChatWindow />)
    expect(container).toBeInTheDocument()
    const threadItems = container.querySelectorAll(".thread-item")
    expect(threadItems).toHaveLength(4)
    expect(threadItems[0]).toHaveTextContent("ThreadItem - type: question")
    expect(threadItems[1]).toHaveTextContent("ThreadItem - type: answer")
    expect(threadItems[2]).toHaveTextContent("ThreadItem - type: question")
    expect(threadItems[3]).toHaveTextContent("ThreadItem - type: answer")
  })

  test("show error message when error is not empty", () => {
    AiAssistantMocks.mockUseChat.mockReturnValueOnce({
      ...AiAssistantMocks.defaultUseChatReturn,
      error: "error",
    })
    const { container } = render(<AiAssistantChatWindow />)
    expect(container).toBeInTheDocument()
    expect(container).toHaveTextContent("ThreadItem - type: error")
  })
})

describe("keyboard shortcuts", () => {
  test("escape key should close chat window", () => {
    AiAssistantMocks.mockUseAiAssistant.mockReturnValueOnce({
      ...AiAssistantMocks.defaultUseAiAssistantReturn,
      chatOpened: true,
    })
    const { container } = render(<AiAssistantChatWindow />)
    expect(container).toBeInTheDocument()

    // Focus an element inside the chat window to satisfy the contains check
    // The chat window ref needs to contain the active element
    const chatWindow = container.querySelector(".z-50.flex") as HTMLElement
    expect(chatWindow).toBeInTheDocument()

    // Create a focusable element inside the chat window and focus it
    const focusableElement = document.createElement("div")
    focusableElement.setAttribute("tabindex", "0")
    chatWindow.appendChild(focusableElement)
    focusableElement.focus()

    // Fire Escape key on window (where useKeyboardShortcut listens)
    fireEvent.keyDown(window, { key: "Escape" })

    // Verify that setChatOpened(false) was called
    expect(AiAssistantMocks.mockSetChatOpened).toHaveBeenCalledWith(false)
  })
})

describe("scroll", () => {
  test("show fade when scroll is not at the bottom", () => {
    AiAssistantMocks.mockUseAiAssistant.mockReturnValueOnce({
      ...AiAssistantMocks.defaultUseAiAssistantReturn,
      chatOpened: true,
      loading: false,
    })
    const { container } = render(<AiAssistantChatWindow />)
    expect(container).toBeInTheDocument()

    // Find the fade element
    const fade = container.querySelector(".bg-ai-assistant-bottom")
    expect(fade).toBeInTheDocument()

    // Find the scrollable parent element (contentRef.current.parentElement)
    // This is the div with class "overflow-y-auto flex-auto px-docs_0.5 pt-docs_0.25 pb-docs_2"
    const scrollableParent = container.querySelector(
      ".overflow-y-auto.flex-auto"
    ) as HTMLElement
    expect(scrollableParent).toBeInTheDocument()

    // Initially, fade should not be shown (opacity-0)
    expect(fade).toHaveClass("opacity-0")
    expect(fade).not.toHaveClass("opacity-100")

    // Set up scroll dimensions to simulate not being at the bottom
    // The condition is: offsetHeight + scrollTop < scrollHeight - 1
    // So if scrollHeight is 1000, offsetHeight is 500, scrollTop is 0
    // Then 500 + 0 < 1000 - 1 = true, so fade should show
    Object.defineProperty(scrollableParent, "scrollHeight", {
      value: 1000,
      writable: true,
      configurable: true,
    })
    Object.defineProperty(scrollableParent, "offsetHeight", {
      value: 500,
      writable: true,
      configurable: true,
    })
    Object.defineProperty(scrollableParent, "scrollTop", {
      value: 0,
      writable: true,
      configurable: true,
    })

    // Fire scroll event on the parent element
    fireEvent.scroll(scrollableParent)

    // Fade should now be shown (opacity-100)
    expect(fade).toHaveClass("opacity-100")
  })

  test("hide fade when scroll is at the bottom", () => {
    AiAssistantMocks.mockUseAiAssistant.mockReturnValueOnce({
      ...AiAssistantMocks.defaultUseAiAssistantReturn,
      chatOpened: true,
      loading: false,
    })
    const { container } = render(<AiAssistantChatWindow />)
    expect(container).toBeInTheDocument()

    const fade = container.querySelector(".bg-ai-assistant-bottom")
    expect(fade).toBeInTheDocument()

    const scrollableParent = container.querySelector(
      ".overflow-y-auto.flex-auto"
    ) as HTMLElement
    expect(scrollableParent).toBeInTheDocument()

    // Set up scroll dimensions to simulate being at the bottom
    // offsetHeight + scrollTop >= scrollHeight - 1
    // So if scrollHeight is 1000, offsetHeight is 500, scrollTop is 500
    // Then 500 + 500 >= 1000 - 1 = true, so fade should hide
    Object.defineProperty(scrollableParent, "scrollHeight", {
      value: 1000,
      writable: true,
      configurable: true,
    })
    Object.defineProperty(scrollableParent, "offsetHeight", {
      value: 500,
      writable: true,
      configurable: true,
    })
    Object.defineProperty(scrollableParent, "scrollTop", {
      value: 500,
      writable: true,
      configurable: true,
    })

    // Fire scroll event
    fireEvent.scroll(scrollableParent)

    // Fade should be hidden
    expect(fade).not.toHaveClass("opacity-100")
  })
})
