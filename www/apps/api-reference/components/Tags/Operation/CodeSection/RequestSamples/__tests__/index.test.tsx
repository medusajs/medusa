import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { cleanup, render } from "@testing-library/react"

// mock data
const mockCodeSamples = [
  {
    label: "Request Sample 1",
    lang: "javascript",
    source: "console.log('Request Sample 1')",
  },
  {
    label: "Request Sample 2",
    lang: "bash",
    source: "echo 'Request Sample 2'",
  },
]

// mock components
vi.mock("docs-ui", () => ({
  CodeBlock: ({ 
    source,
    collapsed,
    className,
    lang
  }: { 
    source: string,
    collapsed: boolean,
    className: string
    lang: string
  }) => (
    <div data-testid="code-block" data-collapsed={collapsed} className={className} data-lang={lang}>{source}</div>
  ),
  CodeTab: ({ 
    children,
    label,
    value
  }: { 
    children: React.ReactNode,
    label: string,
    value: string
  }) => (
    <div data-testid="code-tab" data-label={label} data-value={value}>{children}</div>
  ),
  CodeTabs: ({ 
    children,
    group
  }: { 
    children: React.ReactNode,
    group: string
  }) => (
    <div data-testid="code-tabs" data-group={group}>{children}</div>
  ),
}))
vi.mock("slugify", () => ({
  default: vi.fn((text: string) => text.toLowerCase()),
}))

import TagOperationCodeSectionRequestSamples from ".."

beforeEach(() => {
  vi.clearAllMocks()
  cleanup()
})

describe("rendering", () => {
  test("renders code tabs and blocks for each code sample", () => {
    const { getByTestId, getAllByTestId } = render(
      <TagOperationCodeSectionRequestSamples codeSamples={mockCodeSamples} />
    )
    const codeTabsElement = getByTestId("code-tabs")
    expect(codeTabsElement).toBeInTheDocument()
    expect(codeTabsElement).toHaveAttribute("data-group", "request-examples")
    const codeBlocksElement = getAllByTestId("code-block")
    expect(codeBlocksElement).toHaveLength(mockCodeSamples.length)
    expect(codeBlocksElement[0]).toHaveAttribute("data-collapsed", "true")
    expect(codeBlocksElement[1]).toHaveAttribute("data-collapsed", "true")
    expect(codeBlocksElement[0]).toHaveClass("!mb-0")
    expect(codeBlocksElement[1]).toHaveClass("!mb-0")
    expect(codeBlocksElement[0]).toHaveAttribute("data-lang", mockCodeSamples[0].lang)
    expect(codeBlocksElement[1]).toHaveAttribute("data-lang", mockCodeSamples[1].lang)
    expect(codeBlocksElement[0]).toHaveTextContent(mockCodeSamples[0].source)
    expect(codeBlocksElement[1]).toHaveTextContent(mockCodeSamples[1].source)
  })
})