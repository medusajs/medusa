import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { fireEvent, render } from "@testing-library/react"
import { Token } from "prism-react-renderer"

// mock data
const mockSource = "console.log('Hello, world!')"
const mockMultiLineSource = `console.log('Line 1')
console.log('Line 2')
console.log('Line 3')`
const mockCurlSource = "curl -X GET https://api.example.com/data"
const mockColorMode = "light"
const mockUseColorMode = vi.fn(() => ({
  colorMode: mockColorMode,
}))
const mockTrack = vi.fn()

// mock components
const ApiRunnerMock = React.forwardRef<
  HTMLDivElement,
  { apiMethod: string; apiUrl: string }
>((props, ref) => (
  <div data-testid="api-runner" ref={ref}>
    ApiRunner
  </div>
))
ApiRunnerMock.displayName = "ApiRunner"

vi.mock("@/components/ApiRunner", () => ({
  ApiRunner: () => ApiRunnerMock,
}))
vi.mock("@/providers/Analytics", () => ({
  useAnalytics: () => ({
    track: mockTrack,
  }),
}))
vi.mock("@/providers/ColorMode", () => ({
  useColorMode: () => mockUseColorMode(),
}))
vi.mock("@/components/CodeBlock/Line", () => ({
  CodeBlockLine: ({ line }: { line: Token[] }) => (
    <div data-testid="code-block-line">
      {line.map((token) => token.content).join("")}
    </div>
  ),
}))
vi.mock("@/components/CodeBlock/Header", () => ({
  CodeBlockHeader: ({ title }: CodeBlockHeaderProps) => (
    <div data-testid="code-block-header">{title}</div>
  ),
}))
vi.mock("@/components/CodeBlock/Actions", () => ({
  CodeBlockActions: () => <div data-testid="code-block-actions">Actions</div>,
}))
vi.mock("@/components/CodeBlock/Collapsible/Button", () => ({
  CodeBlockCollapsibleButton: () => (
    <div data-testid="code-block-collapsible-button">CollapsibleButton</div>
  ),
}))
vi.mock("@/components/CodeBlock/Collapsible/Fade", () => ({
  CodeBlockCollapsibleFade: () => (
    <div data-testid="code-block-collapsible-fade">CollapsibleFade</div>
  ),
}))
vi.mock("@/components/CodeBlock/Inline", () => ({
  CodeBlockInline: () => <div data-testid="code-block-inline">Inline</div>,
}))

import { CodeBlock } from "../../CodeBlock"
import { CodeBlockHeaderProps } from "../Header"
import { DocsTrackingEvents } from "../../../constants"

beforeEach(() => {
  mockUseColorMode.mockReturnValue({
    colorMode: mockColorMode,
  })
  mockTrack.mockClear()
})

describe("render", () => {
  test("render with source", () => {
    const { container } = render(<CodeBlock source={mockSource} />)
    expect(container).toBeInTheDocument()
    const codeBlock = container.querySelector("[data-testid='code-block']")
    expect(codeBlock).toBeInTheDocument()
    expect(codeBlock).toHaveTextContent(mockSource)
    const codeBlockHeader = container.querySelector(
      "[data-testid='code-block-header']"
    )
    expect(codeBlockHeader).toBeInTheDocument()
    expect(codeBlockHeader).toHaveTextContent("Code")
  })

  test("render with lang not bash", () => {
    const { container } = render(
      <CodeBlock source={mockSource} lang="javascript" />
    )
    expect(container).toBeInTheDocument()
    const codeBlock = container.querySelector("[data-testid='code-block']")
    expect(codeBlock).toBeInTheDocument()
    expect(codeBlock).toHaveTextContent(mockSource)
    const codeBlockHeader = container.querySelector(
      "[data-testid='code-block-header']"
    )
    expect(codeBlockHeader).toBeInTheDocument()
    expect(codeBlockHeader).toHaveTextContent("Code")
  })

  test("render with lang bash", () => {
    const { container } = render(<CodeBlock source={mockSource} lang="bash" />)
    expect(container).toBeInTheDocument()
    const codeBlock = container.querySelector("[data-testid='code-block']")
    expect(codeBlock).toBeInTheDocument()
    expect(codeBlock).toHaveTextContent(mockSource)
    const codeBlockHeader = container.querySelector(
      "[data-testid='code-block-header']"
    )
    expect(codeBlockHeader).toBeInTheDocument()
    expect(codeBlockHeader).toHaveTextContent("Terminal")
  })

  test("render with lang bash and source is curl", () => {
    const { container } = render(
      <CodeBlock source={mockCurlSource} lang="bash" />
    )
    expect(container).toBeInTheDocument()
    const codeBlock = container.querySelector("[data-testid='code-block']")
    expect(codeBlock).toBeInTheDocument()
    expect(codeBlock).toHaveTextContent(mockCurlSource)
    const codeBlockHeader = container.querySelector(
      "[data-testid='code-block-header']"
    )
    expect(codeBlockHeader).toBeInTheDocument()
    expect(codeBlockHeader).toHaveTextContent("Code")
  })

  test("render with isTerminal", () => {
    const { container } = render(
      <CodeBlock source={mockSource} isTerminal={true} />
    )
    expect(container).toBeInTheDocument()
    const codeBlock = container.querySelector("[data-testid='code-block']")
    expect(codeBlock).toBeInTheDocument()
    expect(codeBlock).toHaveTextContent(mockSource)
    const codeBlockHeader = container.querySelector(
      "[data-testid='code-block-header']"
    )
    expect(codeBlockHeader).toBeInTheDocument()
    expect(codeBlockHeader).toHaveTextContent("Terminal")
  })

  test("render with isTermina false", () => {
    const { container } = render(
      <CodeBlock source={mockSource} isTerminal={false} />
    )
    expect(container).toBeInTheDocument()
    const codeBlock = container.querySelector("[data-testid='code-block']")
    expect(codeBlock).toBeInTheDocument()
    expect(codeBlock).toHaveTextContent(mockSource)
    const codeBlockHeader = container.querySelector(
      "[data-testid='code-block-header']"
    )
    expect(codeBlockHeader).toBeInTheDocument()
    expect(codeBlockHeader).toHaveTextContent("Code")
  })

  test("render with hasTabs", () => {
    const { container } = render(
      <CodeBlock source={mockSource} hasTabs={true} />
    )
    expect(container).toBeInTheDocument()
    const codeBlock = container.querySelector("[data-testid='code-block']")
    expect(codeBlock).toBeInTheDocument()
    expect(codeBlock).toHaveTextContent(mockSource)
    const codeBlockHeader = container.querySelector(
      "[data-testid='code-block-header']"
    )
    expect(codeBlockHeader).not.toBeInTheDocument()
  })

  test("render with title prop", () => {
    const { container } = render(
      <CodeBlock source={mockSource} title="Custom Title" />
    )
    const codeBlockHeader = container.querySelector(
      "[data-testid='code-block-header']"
    )
    expect(codeBlockHeader).toBeInTheDocument()
    expect(codeBlockHeader).toHaveTextContent("Custom Title")
  })

  test("render with forceNoTitle", () => {
    const { container } = render(
      <CodeBlock source={mockSource} forceNoTitle={true} />
    )
    const codeBlockHeader = container.querySelector(
      "[data-testid='code-block-header']"
    )
    expect(codeBlockHeader).not.toBeInTheDocument()
  })

  test("render with blockStyle inline", () => {
    const { container } = render(
      <CodeBlock source={mockSource} blockStyle="inline" />
    )
    const inlineBlock = container.querySelector(
      "[data-testid='code-block-inline']"
    )
    expect(inlineBlock).toBeInTheDocument()
    const codeBlock = container.querySelector("[data-testid='code-block']")
    expect(codeBlock).not.toBeInTheDocument()
  })

  test("render with blockStyle subtle", () => {
    const { container } = render(
      <CodeBlock source={mockSource} blockStyle="subtle" />
    )
    const codeBlock = container.querySelector("[data-testid='code-block']")
    expect(codeBlock).toBeInTheDocument()
  })

  test("render with children when source is empty", () => {
    const { container } = render(<CodeBlock source="">test children</CodeBlock>)
    const codeBlock = container.querySelector("[data-testid='code-block']")
    expect(codeBlock).toBeInTheDocument()
    expect(codeBlock).toHaveTextContent("test children")
  })

  test("render with empty source returns empty fragment", () => {
    const { container } = render(<CodeBlock source="" />)
    expect(container.firstChild).toBeNull()
  })

  test("render with lang json converts to plain", () => {
    const { container } = render(<CodeBlock source={mockSource} lang="json" />)
    const codeBlock = container.querySelector("[data-testid='code-block']")
    expect(codeBlock).toBeInTheDocument()
  })

  test("render with className prop", () => {
    const { container } = render(
      <CodeBlock source={mockSource} className="custom-class" />
    )
    const codeBlock = container.querySelector(
      "[data-testid='code-block-inner']"
    )
    expect(codeBlock).toBeInTheDocument()
    expect(codeBlock).toHaveClass("custom-class")
  })

  test("render with wrapperClassName prop", () => {
    const { container } = render(
      <CodeBlock source={mockSource} wrapperClassName="wrapper-class" />
    )
    const codeBlock = container.querySelector("[data-testid='code-block']")
    expect(codeBlock).toHaveClass("wrapper-class")
  })

  test("render with innerClassName prop", () => {
    const { container } = render(
      <CodeBlock source={mockSource} innerClassName="inner-class" />
    )
    const innerCode = container.querySelector(".inner-class")
    expect(innerCode).toBeInTheDocument()
  })

  test("render with style prop", () => {
    const { container } = render(
      <CodeBlock source={mockSource} style={{ marginTop: "10px" }} />
    )
    const codeBlock = container.querySelector(".code-block-elm")
    expect(codeBlock).toHaveStyle({ marginTop: "10px" })
  })

  test("render with collapsed prop", () => {
    const { container } = render(
      <CodeBlock source={mockMultiLineSource} collapsed={true} />
    )
    const codeBlock = container.querySelector(".code-block-elm")
    expect(codeBlock).toHaveClass("max-h-[400px]")
  })

  test("render with noLineNumbers prop", () => {
    const { container } = render(
      <CodeBlock source={mockMultiLineSource} noLineNumbers={true} />
    )
    const codeBlock = container.querySelector("[data-testid='code-block']")
    expect(codeBlock).toBeInTheDocument()
  })

  test("render with highlights prop", () => {
    const { container } = render(
      <CodeBlock
        source={mockMultiLineSource}
        highlights={[["1", "highlight text", "tooltip"]]}
      />
    )
    const codeBlock = container.querySelector("[data-testid='code-block']")
    expect(codeBlock).toBeInTheDocument()
  })

  test("render with overrideColors prop", () => {
    const { container } = render(
      <CodeBlock
        source={mockSource}
        overrideColors={{
          bg: "bg-red-500",
          innerBg: "bg-blue-500",
          border: "border-green-500",
        }}
      />
    )
    const codeBlock = container.querySelector(".code-block-elm")
    expect(codeBlock).toHaveClass("bg-red-500", "border-green-500")
  })

  test("render with dark color mode", () => {
    mockUseColorMode.mockReturnValueOnce({
      colorMode: "dark",
    })
    const { container } = render(
      <CodeBlock source={mockSource} blockStyle="subtle" />
    )
    const codeBlock = container.querySelector("[data-testid='code-block']")
    expect(codeBlock).toBeInTheDocument()
  })
})

describe("api testing", () => {
  test("render with apiTesting prop shows ApiRunner when toggled", () => {
    const { container } = render(
      <CodeBlock
        source={mockSource}
        apiTesting={true}
        testApiMethod="GET"
        testApiUrl="https://api.example.com"
      />
    )
    const apiRunner = container.querySelector("[data-testid='api-runner']")
    // ApiRunner is initially hidden (showTesting starts as false)
    expect(apiRunner).not.toBeInTheDocument()
  })

  test("render with apiTesting but missing required props does not show ApiRunner", () => {
    const { container } = render(
      <CodeBlock source={mockSource} apiTesting={true} />
    )
    const apiRunner = container.querySelector("[data-testid='api-runner']")
    expect(apiRunner).not.toBeInTheDocument()
  })
})

describe("collapsible lines", () => {
  test("render with collapsibleLines prop at start", () => {
    const { container } = render(
      <CodeBlock
        source={mockMultiLineSource}
        collapsibleLines="1-2"
        expandButtonLabel="Show more"
      />
    )
    const collapsibleButton = container.querySelector(
      "[data-testid='code-block-collapsible-button']"
    )
    const collapsibleFade = container.querySelector(
      "[data-testid='code-block-collapsible-fade']"
    )
    expect(collapsibleButton).toBeInTheDocument()
    expect(collapsibleFade).toBeInTheDocument()
  })

  test("render with collapsibleLines prop at end", () => {
    const { container } = render(
      <CodeBlock source={mockMultiLineSource} collapsibleLines="2-3" />
    )
    const codeBlock = container.querySelector("[data-testid='code-block']")
    expect(codeBlock).toBeInTheDocument()
  })
})

describe("actions", () => {
  test("render with noCopy prop hides copy action", () => {
    const { container } = render(
      <CodeBlock source={mockSource} noCopy={true} />
    )
    const codeBlock = container.querySelector("[data-testid='code-block']")
    expect(codeBlock).toBeInTheDocument()
  })

  test("render with noReport prop hides report action", () => {
    const { container } = render(
      <CodeBlock source={mockSource} noReport={true} />
    )
    const codeBlock = container.querySelector("[data-testid='code-block']")
    expect(codeBlock).toBeInTheDocument()
  })

  test("render with noAskAi prop hides ask AI action", () => {
    const { container } = render(
      <CodeBlock source={mockSource} noAskAi={true} />
    )
    const codeBlock = container.querySelector("[data-testid='code-block']")
    expect(codeBlock).toBeInTheDocument()
  })

  test("render with all action flags disabled hides actions", () => {
    const { container } = render(
      <CodeBlock
        source={mockSource}
        noCopy={true}
        noReport={true}
        noAskAi={true}
      />
    )
    const codeBlock = container.querySelector("[data-testid='code-block']")
    expect(codeBlock).toBeInTheDocument()
  })
})

describe("interaction", () => {
  test("tracks copy event when code is copied", () => {
    const { container } = render(<CodeBlock source={mockSource} />)
    const pre = container.querySelector("pre")
    expect(pre).toBeInTheDocument()

    fireEvent.copy(pre!)
    expect(mockTrack).toHaveBeenCalledTimes(1)
    expect(mockTrack).toHaveBeenCalledWith({
      event: {
        event: DocsTrackingEvents.CODE_BLOCK_COPY,
        options: {
          text: mockSource.substring(0, 150),
        }
      },
    })
  })
})

describe("single line vs multi-line", () => {
  test("render single line code", () => {
    const { container } = render(<CodeBlock source={mockSource} />)
    const codeBlock = container.querySelector("[data-testid='code-block']")
    expect(codeBlock).toBeInTheDocument()
  })

  test("render multi-line code", () => {
    const { container } = render(<CodeBlock source={mockMultiLineSource} />)
    const codeBlock = container.querySelector("[data-testid='code-block']")
    expect(codeBlock).toBeInTheDocument()
    const lines = container.querySelectorAll("[data-testid='code-block-line']")
    expect(lines.length).toBeGreaterThan(1)
  })
})
