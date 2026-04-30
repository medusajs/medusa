import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { fireEvent, render } from "@testing-library/react"
import * as AiAssistantMocks from "../../../AiAssistant/__mocks__"

// mock functions
const mockUseSiteConfig = vi.fn()
const defaultUseSiteConfigReturn = {
  config: {
    baseUrl: "https://docs.medusajs.com",
    basePath: "",
    features: {
      aiAssistant: true,
    },
  },
}
const mockUsePathname = vi.fn(() => "")

// mock components
vi.mock("@/providers/AiAssistant", () => ({
  useAiAssistant: () => AiAssistantMocks.mockUseAiAssistant(),
}))
vi.mock("@/providers/SiteConfig", () => ({
  useSiteConfig: () => mockUseSiteConfig(),
}))
vi.mock("@kapaai/react-sdk", () => ({
  useChat: () => AiAssistantMocks.mockUseChat(),
}))
vi.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
}))
vi.mock("@/components/ContentMenu/Section", () => ({
  ContentMenuSection: ({
    title,
    children,
  }: {
    title: string
    children: React.ReactNode
  }) => (
    <div data-testid="content-menu-section" data-title={title}>
      {children}
    </div>
  ),
}))

import { ContentMenuActions } from "../../Actions"

beforeEach(() => {
  AiAssistantMocks.mockSetChatOpened.mockClear()
  AiAssistantMocks.mockUseAiAssistant.mockReturnValue(
    AiAssistantMocks.defaultUseAiAssistantReturn
  )
  AiAssistantMocks.mockSubmitQuery.mockClear()
  AiAssistantMocks.mockUseChat.mockReturnValue(
    AiAssistantMocks.defaultUseChatReturn
  )
  mockUseSiteConfig.mockReturnValue(defaultUseSiteConfigReturn)
})

describe("render", () => {
  test("renders inside Shortcuts section", () => {
    const { container } = render(<ContentMenuActions />)
    const section = container.querySelector(
      "[data-testid='content-menu-section']"
    )
    expect(section).toBeInTheDocument()
    expect(section).toHaveAttribute("data-title", "Shortcuts")
  })

  test("does not render ai assistant button when ai assistant feature is disabled", () => {
    mockUseSiteConfig.mockReturnValueOnce({
      config: {
        ...defaultUseSiteConfigReturn.config,
        features: {
          aiAssistant: false,
        },
      },
    })
    const { container } = render(<ContentMenuActions />)
    const aiAssistantButton = container.querySelector(
      "button[data-testid='ai-assistant-button']"
    )
    expect(aiAssistantButton).not.toBeInTheDocument()
  })

  test("render action menu", () => {
    const { container } = render(<ContentMenuActions />)
    expect(container).toBeInTheDocument()
    const markdownLink = container.querySelector(
      "a[data-testid='markdown-link']"
    )
    expect(markdownLink).toBeInTheDocument()
    expect(markdownLink).toHaveAttribute(
      "href",
      "https://docs.medusajs.com/index.html.md"
    )
    expect(markdownLink).toHaveTextContent("View as Markdown")
    const aiAssistantButton = container.querySelector(
      "button[data-testid='ai-assistant-button']"
    )
    expect(aiAssistantButton).toBeInTheDocument()
    expect(aiAssistantButton).toHaveTextContent("Explain this page")
  })
})

describe("interactions", () => {
  test("handle ai assistant click", () => {
    const { container } = render(<ContentMenuActions />)
    expect(container).toBeInTheDocument()
    const aiAssistantButton = container.querySelector(
      "button[data-testid='ai-assistant-button']"
    )
    expect(aiAssistantButton).toBeInTheDocument()
    fireEvent.click(aiAssistantButton!)
    expect(AiAssistantMocks.mockSetChatOpened).toHaveBeenCalledWith(true)
    expect(AiAssistantMocks.mockSubmitQuery).toHaveBeenCalledWith(
      "Explain the page https://docs.medusajs.com"
    )
  })

  test("handle ai assistant click when loading", () => {
    AiAssistantMocks.mockUseChat.mockReturnValue({
      ...AiAssistantMocks.defaultUseChatReturn,
      isGeneratingAnswer: true,
    })
    const { container } = render(<ContentMenuActions />)
    expect(container).toBeInTheDocument()
    const aiAssistantButton = container.querySelector(
      "button[data-testid='ai-assistant-button']"
    )
    expect(aiAssistantButton).toBeInTheDocument()
    fireEvent.click(aiAssistantButton!)
    expect(AiAssistantMocks.mockSetChatOpened).not.toHaveBeenCalled()
    expect(AiAssistantMocks.mockSubmitQuery).not.toHaveBeenCalled()
  })
})
