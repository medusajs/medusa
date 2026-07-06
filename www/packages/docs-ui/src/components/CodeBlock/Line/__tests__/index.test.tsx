import React from "react"
import { describe, expect, test, vi } from "vitest"
import { render } from "@testing-library/react"
import { MarkdownContentProps } from "../../../MarkdownContent"
import { TooltipProps } from "../../../Tooltip"

// mock data
const mockLine: Token[] = [
  {
    types: ["variable"],
    content: "console",
  },
  {
    types: ["punctuation"],
    content: ".",
  },
  {
    types: ["function"],
    content: "log",
  },
  {
    types: ["delimiter"],
    content: "(",
  },
  {
    types: ["string"],
    content: "'",
  },
  {
    types: ["string"],
    content: "Hello, world!",
  },
  {
    types: ["string"],
    content: "'",
  },
  {
    types: ["delimiter"],
    content: ")",
  },
]

const mockHighlights: Highlight[] = [
  {
    line: 1,
    text: "console",
  },
]
const mockHighlightsInvalidText: Highlight[] = [
  {
    line: 1,
    text: "John",
  },
]
const mockHighlighWithTooltipText: Highlight[] = [
  {
    line: 1,
    text: "console",
    tooltipText: "This is a tooltip text",
  },
]

// mock functions
const mockGetLineProps = ({ line, key }: { line: Token[]; key?: number }) => ({
  className: "text-red-500",
})
const mockGetTokenProps = ({ token, key }: { token: Token; key?: number }) => ({
  className: "text-red-500",
  children: token.content,
})

// mock components
vi.mock("@/components/MarkdownContent", () => ({
  MarkdownContent: ({ children }: MarkdownContentProps) => (
    <div data-testid="markdown-content">{children}</div>
  ),
}))
vi.mock("@/components/Tooltip", () => ({
  Tooltip: ({ children, text, render }: TooltipProps) => (
    <div data-testid="tooltip">
      {/* @ts-expect-error - render is not typed properly */}
      <span data-testid="tooltip-children">{children || render?.()}</span>
      <span data-testid="tooltip-text">{text}</span>
    </div>
  ),
}))

import { CodeBlockLine } from "../index"
import { Token } from "prism-react-renderer"
import { Highlight } from "../.."

describe("render", () => {
  test("render without highlights", () => {
    const { container } = render(
      <CodeBlockLine
        line={mockLine}
        highlights={[]}
        lineNumber={1}
        showLineNumber={true}
        lineNumberColorClassName="text-red-500"
        lineNumberBgClassName="bg-red-500"
        isTerminal={false}
        getLineProps={mockGetLineProps}
        getTokenProps={mockGetTokenProps}
        codeBlockStyle="loud"
      />
    )
    expect(container).toBeInTheDocument()
    const codeBlockLine = container.querySelector(
      "[data-testid='code-block-line']"
    )
    expect(codeBlockLine).toBeInTheDocument()
    expect(codeBlockLine).toHaveClass("text-red-500")
    expect(codeBlockLine).not.toHaveClass("bg-medusa-alpha-white-alpha-6")
    const lineNumber = codeBlockLine?.querySelector(
      "[data-testid='line-number']"
    )
    expect(lineNumber).toBeInTheDocument()
    expect(lineNumber).toHaveTextContent("2")
    expect(lineNumber).toHaveClass("text-red-500")
    expect(lineNumber).toHaveClass("bg-red-500")
    const codeBlockLineTokens = codeBlockLine?.querySelector(
      "[data-testid='code-block-line-tokens']"
    )
    expect(codeBlockLineTokens).toBeInTheDocument()
    expect(codeBlockLineTokens).not.toHaveClass("relative")
    expect(codeBlockLineTokens).toHaveTextContent(
      "console.log('Hello, world!')"
    )
    const codeBlockLineToken = codeBlockLineTokens?.querySelectorAll(
      "[data-testid='code-block-line-token']"
    )
    expect(codeBlockLineToken).toHaveLength(mockLine.length)
    expect(codeBlockLineToken![0]).toBeInTheDocument()
    expect(codeBlockLineToken![0]).toHaveClass("text-red-500")
    expect(codeBlockLineToken![0]).toHaveTextContent("console")
    expect(codeBlockLineToken![0]).not.toHaveClass("relative")
    expect(codeBlockLineToken![1]).toBeInTheDocument()
    expect(codeBlockLineToken![1]).toHaveClass("text-red-500")
    expect(codeBlockLineToken![1]).toHaveTextContent(".")
    expect(codeBlockLineToken![1]).not.toHaveClass("relative")
    expect(codeBlockLineToken![2]).toBeInTheDocument()
    expect(codeBlockLineToken![2]).toHaveClass("text-red-500")
    expect(codeBlockLineToken![2]).toHaveTextContent("log")
    expect(codeBlockLineToken![2]).not.toHaveClass("relative")
    expect(codeBlockLineToken![3]).toBeInTheDocument()
    expect(codeBlockLineToken![3]).toHaveClass("text-red-500")
    expect(codeBlockLineToken![3]).toHaveTextContent("(")
    expect(codeBlockLineToken![3]).not.toHaveClass("relative")
    expect(codeBlockLineToken![4]).toBeInTheDocument()
    expect(codeBlockLineToken![4]).toHaveClass("text-red-500")
    expect(codeBlockLineToken![4]).toHaveTextContent("'")
    expect(codeBlockLineToken![4]).not.toHaveClass("relative")
    expect(codeBlockLineToken![5]).toBeInTheDocument()
    expect(codeBlockLineToken![5]).toHaveClass("text-red-500")
    expect(codeBlockLineToken![5]).toHaveTextContent("Hello, world!")
    expect(codeBlockLineToken![5]).not.toHaveClass("relative")
    expect(codeBlockLineToken![6]).toBeInTheDocument()
    expect(codeBlockLineToken![6]).toHaveClass("text-red-500")
    expect(codeBlockLineToken![6]).toHaveTextContent("'")
    expect(codeBlockLineToken![6]).not.toHaveClass("relative")
    expect(codeBlockLineToken![7]).toBeInTheDocument()
    expect(codeBlockLineToken![7]).toHaveClass("text-red-500")
    expect(codeBlockLineToken![7]).toHaveTextContent(")")
    expect(codeBlockLineToken![7]).not.toHaveClass("relative")
  })

  test("render with highlights", () => {
    const { container } = render(
      <CodeBlockLine
        line={mockLine}
        highlights={mockHighlights}
        lineNumber={1}
        showLineNumber={true}
        lineNumberColorClassName="text-red-500"
        lineNumberBgClassName="bg-red-500"
        isTerminal={false}
        getLineProps={mockGetLineProps}
        getTokenProps={mockGetTokenProps}
        codeBlockStyle="loud"
      />
    )
    expect(container).toBeInTheDocument()
    const codeBlockLine = container.querySelector(
      "[data-testid='code-block-line']"
    )
    expect(codeBlockLine).toBeInTheDocument()
    expect(codeBlockLine).toHaveClass("text-red-500")
    // since token is highlighted, the line will not be highlighted
    expect(codeBlockLine).not.toHaveClass("bg-medusa-alpha-white-alpha-6")
    const lineTokens = codeBlockLine?.querySelectorAll(
      "[data-testid='code-block-line-tokens']"
    )
    expect(lineTokens).toHaveLength(2)
    expect(lineTokens![0]).toHaveClass("relative")
    expect(lineTokens![1]).not.toHaveClass("relative")
    expect(lineTokens![0]).toHaveTextContent("console")
    expect(lineTokens![1]).toHaveTextContent(".log('Hello, world!')")
    const lineHighlight = lineTokens![0].querySelector(
      "[data-testid='code-block-line-highlight']"
    )
    expect(lineHighlight).toBeInTheDocument()
    expect(lineHighlight).not.toHaveClass(
      "animate-fast animate-growWidth animation-fill-forwards"
    )
    expect(lineHighlight).toHaveClass("w-full")
    const highlightedLineTokens = lineTokens![0].querySelectorAll(
      "[data-testid='code-block-line-token']"
    )
    expect(highlightedLineTokens).toHaveLength(1)
    // highlighted text
    expect(highlightedLineTokens![0]).toHaveTextContent("console")
    expect(highlightedLineTokens![0]).toHaveClass("relative z-[1]")
    // not highlighted text
    const notHighlightedLineTokens = lineTokens![1].querySelectorAll(
      "[data-testid='code-block-line-token']"
    )
    expect(notHighlightedLineTokens).toHaveLength(mockLine.length - 1)
    expect(notHighlightedLineTokens![0]).toHaveTextContent(".")
    expect(notHighlightedLineTokens![0]).not.toHaveClass("relative z-[1]")
    expect(notHighlightedLineTokens![1]).toHaveTextContent("log")
    expect(notHighlightedLineTokens![1]).not.toHaveClass("relative z-[1]")
    expect(notHighlightedLineTokens![2]).toHaveTextContent("(")
    expect(notHighlightedLineTokens![2]).not.toHaveClass("relative z-[1]")
    expect(notHighlightedLineTokens![3]).toHaveTextContent("'")
    expect(notHighlightedLineTokens![3]).not.toHaveClass("relative z-[1]")
    expect(notHighlightedLineTokens![4]).toHaveTextContent("Hello, world!")
    expect(notHighlightedLineTokens![4]).not.toHaveClass("relative z-[1]")
    expect(notHighlightedLineTokens![5]).toHaveTextContent("'")
    expect(notHighlightedLineTokens![5]).not.toHaveClass("relative z-[1]")
    expect(notHighlightedLineTokens![6]).toHaveTextContent(")")
    expect(notHighlightedLineTokens![6]).not.toHaveClass("relative z-[1]")
  })

  test("render with highlights and tooltip text", () => {
    const { container } = render(
      <CodeBlockLine
        line={mockLine}
        highlights={mockHighlighWithTooltipText}
        lineNumber={1}
        showLineNumber={true}
        lineNumberColorClassName="text-red-500"
        lineNumberBgClassName="bg-red-500"
        isTerminal={false}
        getLineProps={mockGetLineProps}
        getTokenProps={mockGetTokenProps}
        codeBlockStyle="loud"
      />
    )
    expect(container).toBeInTheDocument()
    const codeBlockLine = container.querySelector(
      "[data-testid='code-block-line']"
    )
    expect(codeBlockLine).toBeInTheDocument()
    const tooltip = container.querySelector("[data-testid='tooltip']")
    expect(tooltip).toBeInTheDocument()
    expect(tooltip).toHaveTextContent("This is a tooltip text")
    const tooltipChildren = tooltip?.querySelector(
      "[data-testid='tooltip-children']"
    )
    expect(tooltipChildren).toBeInTheDocument()
    expect(tooltipChildren).toHaveTextContent("console")
  })

  test("render with highlights and animateTokenHighlights", () => {
    const { container } = render(
      <CodeBlockLine
        line={mockLine}
        highlights={mockHighlights}
        lineNumber={1}
        showLineNumber={true}
        lineNumberColorClassName="text-red-500"
        lineNumberBgClassName="bg-red-500"
        isTerminal={false}
        getLineProps={mockGetLineProps}
        getTokenProps={mockGetTokenProps}
        animateTokenHighlights={true}
        codeBlockStyle="loud"
      />
    )
    expect(container).toBeInTheDocument()
    const codeBlockLine = container.querySelector(
      "[data-testid='code-block-line']"
    )
    expect(codeBlockLine).toBeInTheDocument()
    const codeBlockLineTokens = codeBlockLine?.querySelectorAll(
      "[data-testid='code-block-line-tokens']"
    )
    expect(codeBlockLineTokens).toHaveLength(2)
    expect(codeBlockLineTokens![0]).toHaveClass("relative")
    expect(codeBlockLineTokens![1]).not.toHaveClass("relative")
    expect(codeBlockLineTokens![0]).toHaveTextContent("console")
    expect(codeBlockLineTokens![1]).toHaveTextContent(".log('Hello, world!')")
    const lineHighlight = codeBlockLineTokens![0].querySelector(
      "[data-testid='code-block-line-highlight']"
    )
    expect(lineHighlight).toBeInTheDocument()
    expect(lineHighlight).toHaveClass(
      "animate-fast animate-growWidth animation-fill-forwards"
    )
    expect(lineHighlight).not.toHaveClass("w-full")
  })

  test("render with invalid highlight text", () => {
    const { container } = render(
      <CodeBlockLine
        line={mockLine}
        highlights={mockHighlightsInvalidText}
        lineNumber={1}
        showLineNumber={true}
        lineNumberColorClassName="text-red-500"
        lineNumberBgClassName="bg-red-500"
        isTerminal={false}
        getLineProps={mockGetLineProps}
        getTokenProps={mockGetTokenProps}
        codeBlockStyle="loud"
      />
    )
    expect(container).toBeInTheDocument()
    const codeBlockLine = container.querySelector(
      "[data-testid='code-block-line']"
    )
    expect(codeBlockLine).toBeInTheDocument()
    // line will be highlighted, but not the tokens
    expect(codeBlockLine).toHaveClass("bg-medusa-alpha-white-alpha-6")
    const highlights = codeBlockLine?.querySelectorAll(
      "[data-testid='code-block-line-highlight']"
    )
    expect(highlights).toHaveLength(0)
  })

  test("render with isTerminal", () => {
    const { container } = render(
      <CodeBlockLine
        line={mockLine}
        highlights={mockHighlights}
        lineNumber={1}
        showLineNumber={true}
        lineNumberColorClassName="text-red-500"
        lineNumberBgClassName="bg-red-500"
        isTerminal={true}
        getLineProps={mockGetLineProps}
        getTokenProps={mockGetTokenProps}
        codeBlockStyle="loud"
      />
    )
    expect(container).toBeInTheDocument()
    const codeBlockLine = container.querySelector(
      "[data-testid='code-block-line']"
    )
    expect(codeBlockLine).toBeInTheDocument()
    const lineNumber = codeBlockLine?.querySelector(
      "[data-testid='line-number']"
    )
    expect(lineNumber).toBeInTheDocument()
    expect(lineNumber).toHaveTextContent("❯")
  })

  test("render with false showLineNumber", () => {
    const { container } = render(
      <CodeBlockLine
        line={mockLine}
        highlights={mockHighlights}
        lineNumber={1}
        showLineNumber={false}
        lineNumberColorClassName="text-red-500"
        lineNumberBgClassName="bg-red-500"
        isTerminal={false}
        getLineProps={mockGetLineProps}
        getTokenProps={mockGetTokenProps}
        codeBlockStyle="loud"
      />
    )
    expect(container).toBeInTheDocument()
    const codeBlockLine = container.querySelector(
      "[data-testid='code-block-line']"
    )
    expect(codeBlockLine).toBeInTheDocument()
    const lineNumber = codeBlockLine?.querySelector(
      "[data-testid='line-number']"
    )
    expect(lineNumber).not.toBeInTheDocument()
  })

  test("render with false showLineNumber and isTerminal", () => {
    const { container } = render(
      <CodeBlockLine
        line={mockLine}
        highlights={mockHighlights}
        lineNumber={1}
        showLineNumber={false}
        lineNumberColorClassName="text-red-500"
        lineNumberBgClassName="bg-red-500"
        isTerminal={true}
        getLineProps={mockGetLineProps}
        getTokenProps={mockGetTokenProps}
        codeBlockStyle="loud"
      />
    )
    expect(container).toBeInTheDocument()
    const codeBlockLine = container.querySelector(
      "[data-testid='code-block-line']"
    )
    expect(codeBlockLine).toBeInTheDocument()
    const lineNumber = codeBlockLine?.querySelector(
      "[data-testid='line-number']"
    )
    expect(lineNumber).toBeInTheDocument()
    expect(lineNumber).toHaveTextContent("❯")
  })
})
