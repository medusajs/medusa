import React from "react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"
import { fireEvent, render } from "@testing-library/react"
import * as AiAssistantMocks from "../../../__mocks__"

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

import { AiAssistantChatWindowInput } from "../../Input"
import { DocsTrackingEvents } from "../../../../.."

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
  test("renders the chat window input", () => {
    const { container } = render(
      <AiAssistantChatWindowInput
        chatWindowRef={React.createRef<HTMLDivElement>()}
      />
    )
    const input = container.querySelector("textarea")
    expect(input).toBeInTheDocument()
    expect(input).toHaveValue("")
  })

  test("should focus input when chat is opened", () => {
    AiAssistantMocks.mockUseAiAssistant.mockReturnValueOnce({
      ...AiAssistantMocks.defaultUseAiAssistantReturn,
      chatOpened: true,
    })
    const { container } = render(
      <AiAssistantChatWindowInput
        chatWindowRef={React.createRef<HTMLDivElement>()}
      />
    )
    const input = container.querySelector("textarea")
    expect(input).toBeInTheDocument()
    expect(input).toHaveFocus()
  })
})

describe("form submission", () => {
  test("submits the question when the form is submitted", () => {
    const { container } = render(
      <AiAssistantChatWindowInput
        chatWindowRef={React.createRef<HTMLDivElement>()}
      />
    )
    const input = container.querySelector("textarea")
    expect(input).toBeInTheDocument()
    fireEvent.change(input!, { target: { value: "test" } })
    fireEvent.submit(input!)
    expect(AiAssistantMocks.mockSubmitQuery).toHaveBeenCalledWith("test")
  })
})

describe("stop generation", () => {
  test("should stop generation when loading is true", () => {
    // Set loading to true for this test
    AiAssistantMocks.mockUseAiAssistant.mockReturnValueOnce({
      ...AiAssistantMocks.defaultUseAiAssistantReturn,
      loading: true,
    })

    const { container } = render(
      <AiAssistantChatWindowInput
        chatWindowRef={React.createRef<HTMLDivElement>()}
      />
    )

    const input = container.querySelector("textarea")
    const form = container.querySelector("form")
    const submitButton = form?.querySelector("button[type=submit]")

    expect(input).toBeInTheDocument()
    expect(submitButton).toBeInTheDocument()

    // Verify loading state - button should show stop icon and be enabled
    const stopIcon = submitButton?.querySelector("svg")
    expect(stopIcon).toBeInTheDocument()
    expect(submitButton).not.toBeDisabled()

    // When form is submitted while loading, it should call stopGeneration
    AiAssistantMocks.mockStopGeneration.mockClear()
    fireEvent.submit(input!.closest("form")!)
    expect(AiAssistantMocks.mockStopGeneration).toHaveBeenCalledTimes(1)
  })

  test("should not stop generation when loading is false", () => {
    const { container } = render(
      <AiAssistantChatWindowInput
        chatWindowRef={React.createRef<HTMLDivElement>()}
      />
    )
    const input = container.querySelector("textarea")
    const form = container.querySelector("form")
    const submitButton = form?.querySelector("button[type=submit]")

    expect(input).toBeInTheDocument()
    expect(submitButton).toBeInTheDocument()

    fireEvent.change(input!, { target: { value: "test" } })
    expect(input).toHaveValue("test")
    expect(submitButton).not.toBeDisabled()
    AiAssistantMocks.mockStopGeneration.mockClear()
    fireEvent.submit(input!.closest("form")!)
    expect(AiAssistantMocks.mockStopGeneration).not.toHaveBeenCalled()
  })
})

describe("analytics tracking", () => {
  test("should track start chat event when no conversation", () => {
    AiAssistantMocks.mockConversation.length = 0
    const { container } = render(
      <AiAssistantChatWindowInput
        chatWindowRef={React.createRef<HTMLDivElement>()}
      />
    )
    const input = container.querySelector("textarea")
    expect(input).toBeInTheDocument()
    fireEvent.change(input!, { target: { value: "test" } })
    fireEvent.submit(input!.closest("form")!)
    expect(AiAssistantMocks.mockTrack).toHaveBeenCalledWith({
      event: {
        event: DocsTrackingEvents.AI_ASSISTANT_START_CHAT,
      },
    })
  })

  test("should not track start chat event when conversation is not empty", () => {
    AiAssistantMocks.mockConversation.length = 1
    const { container } = render(
      <AiAssistantChatWindowInput
        chatWindowRef={React.createRef<HTMLDivElement>()}
      />
    )
    const input = container.querySelector("textarea")
    expect(input).toBeInTheDocument()
    fireEvent.change(input!, { target: { value: "test" } })
    fireEvent.submit(input!.closest("form")!)
    expect(AiAssistantMocks.mockTrack).not.toHaveBeenCalled()
  })
})

describe("keyboard interactions", () => {
  test("should set question state to last question when arrow up is pressed and question is empty", () => {
    AiAssistantMocks.mockConversation.getLatest.mockReturnValue({
      question: "last question",
    })
    const { container } = render(
      <AiAssistantChatWindowInput
        chatWindowRef={React.createRef<HTMLDivElement>()}
      />
    )
    const input = container.querySelector("textarea")
    expect(input).toBeInTheDocument()
    fireEvent.keyDown(input!, { key: "ArrowUp" })
    expect(input).toHaveValue("last question")
  })

  test("should not set question state to last question when arrow up is pressed and question is not empty", () => {
    AiAssistantMocks.mockConversation.getLatest.mockReturnValue({
      question: "last question",
    })
    const { container } = render(
      <AiAssistantChatWindowInput
        chatWindowRef={React.createRef<HTMLDivElement>()}
      />
    )
    const input = container.querySelector("textarea")
    expect(input).toBeInTheDocument()
    fireEvent.change(input!, { target: { value: "test" } })
    fireEvent.keyDown(input!, { key: "ArrowUp" })
    expect(input).toHaveValue("test")
  })

  test("should add new line when shift + enter are pressed and question is not empty", () => {
    AiAssistantMocks.mockConversation.getLatest.mockReturnValue({
      question: "last question",
    })
    const { container } = render(
      <AiAssistantChatWindowInput
        chatWindowRef={React.createRef<HTMLDivElement>()}
      />
    )
    const input = container.querySelector("textarea")
    expect(input).toBeInTheDocument()
    fireEvent.change(input!, { target: { value: "test" } })
    fireEvent.keyDown(input!, { key: "Enter", shiftKey: true })
    expect(input).toHaveValue("test\n")
  })
})

describe("search query parameters", () => {
  const originalLocation = window.location

  beforeEach(() => {
    // Reset location mock before each test
    delete (window as unknown as { location?: Location }).location
  })

  afterEach(() => {
    // Restore original location after each test
    Object.defineProperty(window, "location", {
      value: originalLocation,
      writable: true,
      configurable: true,
    })
  })

  test("should set question from query parameter when query is present", () => {
    // Mock window.location with query parameter
    Object.defineProperty(window, "location", {
      value: {
        ...originalLocation,
        search: "?query=test%20question",
      },
      writable: true,
      configurable: true,
    })

    const { container } = render(
      <AiAssistantChatWindowInput
        chatWindowRef={React.createRef<HTMLDivElement>()}
      />
    )

    const input = container.querySelector("textarea")
    expect(input).toBeInTheDocument()
    expect(input).toHaveValue("test question")
    expect(AiAssistantMocks.mockSetChatOpened).toHaveBeenCalledWith(true)
  })

  test("should set question and submit when queryType is submit", () => {
    // Mock window.location with query parameter and queryType=submit
    Object.defineProperty(window, "location", {
      value: {
        ...originalLocation,
        search: "?query=test%20question&queryType=submit",
      },
      writable: true,
      configurable: true,
    })

    AiAssistantMocks.mockSubmitQuery.mockClear()
    const { container } = render(
      <AiAssistantChatWindowInput
        chatWindowRef={React.createRef<HTMLDivElement>()}
      />
    )

    const input = container.querySelector("textarea")
    expect(input).toBeInTheDocument()
    expect(AiAssistantMocks.mockSetChatOpened).toHaveBeenCalledWith(true)
    expect(AiAssistantMocks.mockSubmitQuery).toHaveBeenCalledWith(
      "test question"
    )
  })

  test("should not set question when query parameter is not present", () => {
    // Mock window.location without query parameter
    Object.defineProperty(window, "location", {
      value: {
        ...originalLocation,
        search: "",
      },
      writable: true,
      configurable: true,
    })

    const { container } = render(
      <AiAssistantChatWindowInput
        chatWindowRef={React.createRef<HTMLDivElement>()}
      />
    )

    const input = container.querySelector("textarea")
    expect(input).toBeInTheDocument()
    expect(input).toHaveValue("")
  })

  test("should not set question when isCaptchaLoaded is false", () => {
    // Mock window.location with query parameter
    Object.defineProperty(window, "location", {
      value: {
        ...originalLocation,
        search: "?query=test%20question",
      },
      writable: true,
      configurable: true,
    })

    // Set isCaptchaLoaded to false
    AiAssistantMocks.mockUseAiAssistant.mockReturnValueOnce({
      ...AiAssistantMocks.defaultUseAiAssistantReturn,
      isCaptchaLoaded: false,
    })

    const { container } = render(
      <AiAssistantChatWindowInput
        chatWindowRef={React.createRef<HTMLDivElement>()}
      />
    )

    const input = container.querySelector("textarea")
    expect(input).toBeInTheDocument()
    expect(input).toHaveValue("")
    expect(AiAssistantMocks.mockSetChatOpened).not.toHaveBeenCalled()
  })
})

describe("deep thinking", () => {
  test("should toggle deep thinking when button is clicked", () => {
    const { container } = render(
      <AiAssistantChatWindowInput
        chatWindowRef={React.createRef<HTMLDivElement>()}
      />
    )

    const deepThinkingButton = container.querySelector("button")
    expect(deepThinkingButton).toBeInTheDocument()
    fireEvent.click(deepThinkingButton!)
    expect(AiAssistantMocks.mockToggle).toHaveBeenCalled()
  })

  test("button should be disabled when loading is true", () => {
    AiAssistantMocks.mockUseAiAssistant.mockReturnValueOnce({
      ...AiAssistantMocks.defaultUseAiAssistantReturn,
      loading: true,
    })

    const { container } = render(
      <AiAssistantChatWindowInput
        chatWindowRef={React.createRef<HTMLDivElement>()}
      />
    )
    const deepThinkingButton = container.querySelector("button")
    expect(deepThinkingButton).toBeInTheDocument()
    expect(deepThinkingButton).toBeDisabled()
  })

  test("button should have light bulb icon when deep thinking is inactive", () => {
    const { container } = render(
      <AiAssistantChatWindowInput
        chatWindowRef={React.createRef<HTMLDivElement>()}
      />
    )
    const deepThinkingButton = container.querySelector("button")
    const icon = deepThinkingButton?.querySelector("svg")
    expect(icon).toBeInTheDocument()
    expect(icon).not.toHaveClass("text-medusa-tag-orange-icon")
  })

  test("button should have light bulb solid icon when deep thinking is active", () => {
    AiAssistantMocks.mockUseDeepThinking.mockReturnValueOnce({
      active: true,
      toggle: AiAssistantMocks.mockToggle,
    })
    const { container } = render(
      <AiAssistantChatWindowInput
        chatWindowRef={React.createRef<HTMLDivElement>()}
      />
    )
    const deepThinkingButton = container.querySelector("button")
    const icon = deepThinkingButton?.querySelector("svg")
    expect(icon).toBeInTheDocument()
    expect(icon).toHaveClass("text-medusa-tag-orange-icon")
  })
})
