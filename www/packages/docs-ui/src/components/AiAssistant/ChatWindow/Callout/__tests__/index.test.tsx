import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { cleanup, fireEvent, render } from "@testing-library/react"
import * as AiAssistantMocks from "../../../__mocks__"

// mock functions
const mockUseMedusaSuggestions = vi.fn((options) => null as unknown)
const mockTrack = vi.fn()

// mock components and hooks
vi.mock("@/providers/AiAssistant", () => ({
  useAiAssistant: () => AiAssistantMocks.mockUseAiAssistant(),
}))
vi.mock("@kapaai/react-sdk", () => ({
  useChat: () => AiAssistantMocks.mockUseChat(),
}))
vi.mock("@/hooks/use-medusa-suggestions", () => ({
  useMedusaSuggestions: (options: unknown) => mockUseMedusaSuggestions(options),
}))
vi.mock("@/components/Card", () => ({
  Card: (props: { title: string, onClick: () => void }) => (
    <div data-testid="card" onClick={props.onClick}>{props.title}</div>
  ),
}))
vi.mock("@/providers/Analytics", () => ({
  useAnalytics: () => ({
    track: mockTrack,
  }),
}))
vi.mock("@/components/Button", () => ({
  Button: ({
    onClick,
    children,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode }) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
}))
vi.mock("@medusajs/icons", () => ({
  XMark: () => <span data-testid="xmark-icon">✕</span>,
}))

import { AiAssistantChatWindowCallout } from "../index"
import { DocsTrackingEvents } from "../../../../../constants"

beforeEach(() => {
  vi.clearAllMocks()
  cleanup()
})

describe("render", () => {
  test("should not render when there is no matched suggestion", () => {
    mockUseMedusaSuggestions.mockReturnValueOnce(null)

    const { container } = render(<AiAssistantChatWindowCallout />)

    expect(container.firstChild).toBeNull()
  })
  
  test("should render when there is a matched suggestion", () => {
    const mockCardProps = {
      title: "Test Card",
      text: "This is a test card.",
      href: "https://example.com",
      icon: () => <div>Icon</div>,
    }
    mockUseMedusaSuggestions.mockReturnValueOnce(mockCardProps)

    const { getByTestId } = render(<AiAssistantChatWindowCallout />)

    expect(getByTestId("card")).toBeInTheDocument()
    expect(getByTestId("card")).toHaveTextContent("Test Card")
  })

  test("should not render when loading is true", () => {
    AiAssistantMocks.mockUseAiAssistant.mockReturnValueOnce({
      ...AiAssistantMocks.defaultUseAiAssistantReturn,
      loading: true,
    })

    mockUseMedusaSuggestions.mockReturnValueOnce({
      title: "Test Card",
      text: "This is a test card.",
      href: "https://example.com",
      icon: () => <div>Icon</div>,
    })

    const { container } = render(<AiAssistantChatWindowCallout />)

    expect(container.firstChild).toBeNull()
  })

  test("should pass correct keywords to useMedusaSuggestions", () => {
    render(<AiAssistantChatWindowCallout />)

    expect(mockUseMedusaSuggestions).toHaveBeenCalledWith({
      keywords: AiAssistantMocks.mockConversation.getLatestCompleted()?.question || "",
    })
  })
})

describe("interactions", () => {
  test("should track event on card click", () => {
    const mockCardProps = {
      title: "Test Card",
      text: "This is a test card.",
      href: "https://example.com",
      icon: () => <div>Icon</div>,
    }
    mockUseMedusaSuggestions.mockReturnValueOnce(mockCardProps)

    const { getByTestId } = render(<AiAssistantChatWindowCallout />)

    const cardElement = getByTestId("card")
    expect(cardElement).toBeInTheDocument()

    // Simulate click
    fireEvent.click(cardElement!)

    expect(mockTrack).toHaveBeenCalledWith({
      event: {
        event: DocsTrackingEvents.AI_ASSISTANT_CALLOUT_CLICK,
        options: {
          user_keywords: AiAssistantMocks.mockConversation.getLatestCompleted()?.question || "",
          callout_title: mockCardProps.title,
          callout_href: mockCardProps.href,
        },
      },
    })
  })
})

describe("dismiss", () => {
  const mockCardProps = {
    title: "Test Card",
    text: "This is a test card.",
    href: "https://example.com",
    icon: () => <div>Icon</div>,
  }

  test("should show dismiss button when callout is visible", () => {
    mockUseMedusaSuggestions.mockReturnValueOnce(mockCardProps)

    const { container } = render(<AiAssistantChatWindowCallout />)

    // The callout card should be visible
    expect(container.querySelector("[data-testid='card']")).toBeInTheDocument()

    // The dismiss button must be present with the expected aria-label
    const dismissButton = container.querySelector(
      "[aria-label='Dismiss Bloom AI suggestion']"
    )
    expect(dismissButton).toBeInTheDocument()
  })

  test("should hide callout when dismiss button is clicked", () => {
    mockUseMedusaSuggestions.mockReturnValueOnce(mockCardProps)

    const { container } = render(<AiAssistantChatWindowCallout />)

    // Card is initially visible
    expect(container.querySelector("[data-testid='card']")).toBeInTheDocument()

    // Click the dismiss button
    const dismissButton = container.querySelector(
      "[aria-label='Dismiss Bloom AI suggestion']"
    ) as HTMLButtonElement
    expect(dismissButton).toBeInTheDocument()
    fireEvent.click(dismissButton)

    // Callout must no longer be rendered after dismissal
    expect(container.firstChild).toBeNull()
  })

  test("should reset dismissed state when question changes", () => {
    mockUseMedusaSuggestions.mockReturnValue(mockCardProps)

    const { container, rerender } = render(<AiAssistantChatWindowCallout />)

    // Dismiss the callout
    const dismissButton = container.querySelector(
      "[aria-label='Dismiss Bloom AI suggestion']"
    ) as HTMLButtonElement
    fireEvent.click(dismissButton)
    expect(container.firstChild).toBeNull()

    // Simulate a new question arriving by overriding the conversation mock
    AiAssistantMocks.mockUseChat.mockReturnValueOnce({
      ...AiAssistantMocks.defaultUseChatReturn,
      conversation: {
        ...AiAssistantMocks.mockConversation,
        getLatestCompleted: () => ({ question: "new question after dismiss" }),
      },
    })

    rerender(<AiAssistantChatWindowCallout />)

    // After the question changes, useEffect resets dismissed to false
    // and the callout reappears for the new question
    expect(container.querySelector("[data-testid='card']")).toBeInTheDocument()
  })
})