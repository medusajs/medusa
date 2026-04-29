import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { fireEvent, render } from "@testing-library/react"
import * as AiAssistantMocks from "../../../../AiAssistant/__mocks__"

// mock functions
const mockUseSiteConfig = vi.fn()

const defaultUseSiteConfigReturn = {
  config: {
    features: {
      aiAssistant: true,
    },
  },
}

// mock components
vi.mock("@/providers/AiAssistant", () => ({
  useAiAssistant: () => AiAssistantMocks.mockUseAiAssistant(),
}))
vi.mock("@kapaai/react-sdk", () => ({
  useChat: () => AiAssistantMocks.mockUseChat(),
}))
vi.mock("@/providers/SiteConfig", () => ({
  useSiteConfig: () => mockUseSiteConfig(),
}))
vi.mock("@/components/Tooltip", () => ({
  Tooltip: ({
    children,
    innerClassName,
  }: {
    children: React.ReactNode
    innerClassName: string
  }) => (
    <div data-testid="tooltip">
      {children} - {innerClassName}
    </div>
  ),
}))

vi.mock("@/components/Icons/Bloom", () => ({
  BloomIcon: () => <span data-testid="bloom-icon" />,
}))

import { CodeBlockAskAiAction } from "../../AskAi"

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

describe("rendering", () => {
  test("does not render when ai assistant feature is disabled", () => {
    mockUseSiteConfig.mockReturnValueOnce({
      config: {
        features: {
          aiAssistant: false,
        },
      },
    })
    const { container } = render(
      <CodeBlockAskAiAction
        source="console.log('Hello, world!');"
        inHeader={false}
      />
    )
    expect(container).toBeEmptyDOMElement()
  })

  test("render code block ask ai action in header", () => {
    const { container } = render(
      <CodeBlockAskAiAction
        source="console.log('Hello, world!');"
        inHeader={true}
      />
    )
    expect(container).toBeInTheDocument()
    const tooltip = container.querySelector("[data-testid='tooltip']")
    expect(tooltip).toBeInTheDocument()
    expect(tooltip).toHaveTextContent("flex")
    const span = tooltip?.querySelector("span")
    expect(span).toBeInTheDocument()
    expect(span).toHaveClass("p-[4.5px]")
    expect(span).toHaveClass("cursor-pointer")
    const icon = span?.querySelector("[data-testid='bloom-icon']")
    expect(icon).toBeInTheDocument()
  })

  test("render code block ask ai action not in header", () => {
    const { container } = render(
      <CodeBlockAskAiAction
        source="console.log('Hello, world!');"
        inHeader={false}
      />
    )
    expect(container).toBeInTheDocument()
    const tooltip = container.querySelector("[data-testid='tooltip']")
    expect(tooltip).toBeInTheDocument()
    const span = tooltip?.querySelector("span")
    expect(span).toBeInTheDocument()
    expect(span).toHaveClass("p-[6px]")
  })
})

describe("interactions", () => {
  test("click code block ask ai action", () => {
    const { container } = render(
      <CodeBlockAskAiAction
        source="console.log('Hello, world!');"
        inHeader={false}
      />
    )
    expect(container).toBeInTheDocument()
    const span = container.querySelector("span")
    expect(span).toBeInTheDocument()
    fireEvent.click(span!)
    expect(AiAssistantMocks.mockSetChatOpened).toHaveBeenCalledWith(true)
    expect(AiAssistantMocks.mockSubmitQuery).toHaveBeenCalledWith(
      "```tsx\nconsole.log('Hello, world!');\n```\n\nExplain the code above"
    )
  })
  test("click code block ask ai action when loading", () => {
    AiAssistantMocks.mockUseAiAssistant.mockReturnValue({
      ...AiAssistantMocks.defaultUseAiAssistantReturn,
      loading: true,
    })
    const { container } = render(
      <CodeBlockAskAiAction
        source="console.log('Hello, world!');"
        inHeader={false}
      />
    )
    expect(container).toBeInTheDocument()
    const span = container.querySelector("span")
    expect(span).toBeInTheDocument()
    fireEvent.click(span!)
    expect(AiAssistantMocks.mockSetChatOpened).not.toHaveBeenCalled()
    expect(AiAssistantMocks.mockSubmitQuery).not.toHaveBeenCalled()
  })
})
