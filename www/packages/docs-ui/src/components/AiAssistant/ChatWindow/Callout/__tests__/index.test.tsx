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