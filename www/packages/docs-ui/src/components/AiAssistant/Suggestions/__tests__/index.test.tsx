import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { fireEvent, render } from "@testing-library/react"
import * as AiAssistantMocks from "../../__mocks__"

const defaultSuggestions = [
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

const mockUseAiAssistant = vi.fn(() => ({
  suggestions: defaultSuggestions,
  hideAiToolsMessage: false,
}))

// Mock components and hooks
vi.mock("@kapaai/react-sdk", () => ({
  useChat: () => AiAssistantMocks.mockUseChat(),
}))
vi.mock("@/providers/AiAssistant", () => ({
  useAiAssistant: () => mockUseAiAssistant(),
}))
vi.mock("@/providers/SiteConfig", () => ({
  useSiteConfig: () => ({
    config: {
      baseUrl: "https://docs.medusajs.com",
    },
  }),
}))
vi.mock("@/components/Link", () => ({
  Link: ({
    children,
    href,
    variant,
  }: {
    children: React.ReactNode
    href: string
    variant: "content"
  }) => (
    <a
      href={href}
      className={
        variant === "content"
          ? "text-medusa-fg-content"
          : "text-medusa-fg-muted"
      }
    >
      {children}
    </a>
  ),
}))

vi.mock("@/components/Search/Hits/GroupName", () => ({
  SearchHitGroupName: ({ name }: { name: string }) => <div>{name}</div>,
}))
vi.mock("@/components/Search/Suggestions/Item", () => ({
  SearchSuggestionItem: ({
    children,
    onClick,
  }: {
    children: React.ReactNode
    onClick: () => void
  }) => (
    <div onClick={onClick} className="suggestion-item">
      {children}
    </div>
  ),
}))
import { AiAssistantSuggestions } from "../index"

beforeEach(() => {
  AiAssistantMocks.mockUseChat.mockReturnValue(
    AiAssistantMocks.defaultUseChatReturn
  )
  AiAssistantMocks.mockAddFeedback.mockClear()
  AiAssistantMocks.mockSubmitQuery.mockClear()
  AiAssistantMocks.mockStopGeneration.mockClear()
  AiAssistantMocks.mockConversation.length = 1

  // Reset to default values
  mockUseAiAssistant.mockReturnValue({
    suggestions: defaultSuggestions,
    hideAiToolsMessage: false,
  })
})

describe("rendering", () => {
  test("renders suggestions", () => {
    const { container } = render(<AiAssistantSuggestions />)
    expect(container).toBeInTheDocument()
    expect(container).toHaveTextContent("FAQ")
    expect(container).toHaveTextContent("Recipes")
    expect(container).toHaveTextContent("What is Medusa?")
    expect(container).toHaveTextContent("How can I create a module?")
    expect(container).toHaveTextContent("How can I create a data model?")
    expect(container).toHaveTextContent("How do I create a workflow?")
    expect(container).toHaveTextContent(
      "How can I extend a data model in the Product Module?"
    )
    expect(container).toHaveTextContent(
      "How do I build a marketplace with Medusa?"
    )
    expect(container).toHaveTextContent(
      "How do I build digital products with Medusa?"
    )
    expect(container).toHaveTextContent(
      "How do I build subscription-based purchases with Medusa?"
    )
    expect(container).toHaveTextContent(
      "What other recipes are available in the Medusa documentation?"
    )
    expect(container).toHaveTextContent("Medusa MCP server")
  })
})

describe("interaction", () => {
  test("clicking a suggestion item should submit the query", () => {
    const { container } = render(<AiAssistantSuggestions />)
    expect(container).toBeInTheDocument()
    const suggestionItem = container.querySelector(".suggestion-item")
    expect(suggestionItem).toBeInTheDocument()
    fireEvent.click(suggestionItem!)
    expect(AiAssistantMocks.mockSubmitQuery).toHaveBeenCalledWith(
      suggestionItem!.textContent
    )
  })
})

describe("hideAiToolsMessage", () => {
  test("shows AI tools message by default", () => {
    const { container } = render(<AiAssistantSuggestions />)
    expect(container).toHaveTextContent("Claude Code Plugins")
    expect(container).toHaveTextContent("Medusa MCP server")
  })

  test("hides AI tools message when hideAiToolsMessage is true", () => {
    mockUseAiAssistant.mockReturnValue({
      suggestions: defaultSuggestions,
      hideAiToolsMessage: true,
    })

    const { container } = render(<AiAssistantSuggestions />)
    expect(container).not.toHaveTextContent("Claude Code Plugins")
    expect(container).not.toHaveTextContent("Medusa MCP server")
  })
})

describe("custom suggestions", () => {
  test("renders custom suggestions", () => {
    const customSuggestions = [
      {
        title: "Custom FAQ",
        items: ["Custom question 1", "Custom question 2"],
      },
      {
        title: "Custom Recipes",
        items: ["Custom recipe 1"],
      },
    ]

    mockUseAiAssistant.mockReturnValue({
      suggestions: customSuggestions,
      hideAiToolsMessage: false,
    })

    const { container } = render(<AiAssistantSuggestions />)
    expect(container).toHaveTextContent("Custom FAQ")
    expect(container).toHaveTextContent("Custom question 1")
    expect(container).toHaveTextContent("Custom question 2")
    expect(container).toHaveTextContent("Custom Recipes")
    expect(container).toHaveTextContent("Custom recipe 1")

    // Should not have default suggestions
    expect(container).not.toHaveTextContent("What is Medusa?")
  })

  test("clicking a custom suggestion item should submit the query", () => {
    const customSuggestions = [
      {
        title: "Custom FAQ",
        items: ["Custom question 1"],
      },
    ]

    mockUseAiAssistant.mockReturnValue({
      suggestions: customSuggestions,
      hideAiToolsMessage: false,
    })

    const { container } = render(<AiAssistantSuggestions />)
    const suggestionItem = container.querySelector(".suggestion-item")
    expect(suggestionItem).toBeInTheDocument()
    expect(suggestionItem).toHaveTextContent("Custom question 1")
    fireEvent.click(suggestionItem!)
    expect(AiAssistantMocks.mockSubmitQuery).toHaveBeenCalledWith(
      "Custom question 1"
    )
  })
})
