import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { fireEvent, render } from "@testing-library/react"
import { VerticalCodeTab } from "../index"

// mock components
vi.mock("@/components/CodeBlock", () => ({
  CodeBlock: ({
    source,
    lang,
    noCopy,
    noReport,
    noAskAi,
    forceNoTitle,
    wrapperClassName,
    className,
    innerClassName,
  }: {
    source?: string
    lang?: string
    noCopy?: boolean
    noReport?: boolean
    noAskAi?: boolean
    forceNoTitle?: boolean
    wrapperClassName?: string
    className?: string
    innerClassName?: string
  }) => (
    <div
      data-testid="code-block"
      data-source={source}
      data-lang={lang}
      data-no-copy={noCopy}
      data-no-report={noReport}
      data-no-ask-ai={noAskAi}
      data-force-no-title={forceNoTitle}
      className={wrapperClassName}
    >
      <pre className={className}>
        <code className={innerClassName}>{source}</code>
      </pre>
    </div>
  ),
}))

import { VerticalCodeTabs } from "../../VerticalCodeTabs"

beforeEach(() => {
  vi.clearAllMocks()
})

describe("rendering", () => {
  test("renders tab buttons", () => {
    const tabs: VerticalCodeTab[] = [
      {
        title: "Tab 1",
        code: { source: "code1", lang: "javascript" },
      },
      {
        title: "Tab 2",
        code: { source: "code2", lang: "typescript" },
      },
    ]
    const { container } = render(
      <VerticalCodeTabs
        tabs={tabs}
        selectedTabIndex={0}
        setSelectedTabIndex={vi.fn()}
      />
    )
    const tabButtons = container.querySelectorAll("li")
    expect(tabButtons).toHaveLength(2)
    expect(tabButtons[0]).toHaveTextContent("Tab 1")
    expect(tabButtons[1]).toHaveTextContent("Tab 2")
  })

  test("renders code block for selected tab", () => {
    const tabs: VerticalCodeTab[] = [
      {
        title: "Tab 1",
        code: { source: "code1", lang: "javascript" },
      },
      {
        title: "Tab 2",
        code: { source: "code2", lang: "typescript" },
      },
    ]
    const { container } = render(
      <VerticalCodeTabs
        tabs={tabs}
        selectedTabIndex={1}
        setSelectedTabIndex={vi.fn()}
      />
    )
    const codeBlock = container.querySelector("[data-testid='code-block']")
    expect(codeBlock).toBeInTheDocument()
    expect(codeBlock).toHaveAttribute("data-source", "code2")
    expect(codeBlock).toHaveAttribute("data-lang", "typescript")
  })

  test("renders three dots indicator", () => {
    const tabs: VerticalCodeTab[] = [
      {
        title: "Tab 1",
        code: { source: "code1", lang: "javascript" },
      },
    ]
    const { container } = render(
      <VerticalCodeTabs
        tabs={tabs}
        selectedTabIndex={0}
        setSelectedTabIndex={vi.fn()}
      />
    )
    const dots = container.querySelectorAll(
      "[data-testid='vertical-code-tabs-dot']"
    )
    expect(dots).toHaveLength(3)
  })

  test("applies selected styles to selected tab", () => {
    const tabs: VerticalCodeTab[] = [
      {
        title: "Tab 1",
        code: { source: "code1", lang: "javascript" },
      },
      {
        title: "Tab 2",
        code: { source: "code2", lang: "typescript" },
      },
    ]
    const { container } = render(
      <VerticalCodeTabs
        tabs={tabs}
        selectedTabIndex={0}
        setSelectedTabIndex={vi.fn()}
      />
    )
    const tabButtons = container.querySelectorAll("li")
    expect(tabButtons[0]).toHaveClass(
      "text-medusa-contrast-fg-primary bg-medusa-contrast-border-bot"
    )
  })

  test("applies unselected styles to unselected tabs", () => {
    const tabs: VerticalCodeTab[] = [
      {
        title: "Tab 1",
        code: { source: "code1", lang: "javascript" },
      },
      {
        title: "Tab 2",
        code: { source: "code2", lang: "typescript" },
      },
    ]
    const { container } = render(
      <VerticalCodeTabs
        tabs={tabs}
        selectedTabIndex={0}
        setSelectedTabIndex={vi.fn()}
      />
    )
    const tabButtons = container.querySelectorAll("li")
    expect(tabButtons[1]).toHaveClass(
      "text-medusa-contrast-fg-secondary bg-medusa-contrast-bg-subtle hover:bg-medusa-contrast-border-bot"
    )
  })

  test("applies custom className", () => {
    const tabs: VerticalCodeTab[] = [
      {
        title: "Tab 1",
        code: { source: "code1", lang: "javascript" },
      },
    ]
    const { container } = render(
      <VerticalCodeTabs
        tabs={tabs}
        selectedTabIndex={0}
        setSelectedTabIndex={vi.fn()}
        className="custom-class"
      />
    )
    const containerDiv = container.querySelector(
      "[data-testid='vertical-code-tabs-container']"
    )
    expect(containerDiv).toBeInTheDocument()
    expect(containerDiv).toHaveClass("custom-class")
  })

  test("passes correct props to CodeBlock", () => {
    const tabs: VerticalCodeTab[] = [
      {
        title: "Tab 1",
        code: { source: "code1", lang: "javascript" },
      },
    ]
    const { container } = render(
      <VerticalCodeTabs
        tabs={tabs}
        selectedTabIndex={0}
        setSelectedTabIndex={vi.fn()}
      />
    )
    const codeBlock = container.querySelector("[data-testid='code-block']")
    expect(codeBlock).toHaveAttribute("data-no-copy", "true")
    expect(codeBlock).toHaveAttribute("data-no-report", "true")
    expect(codeBlock).toHaveAttribute("data-no-ask-ai", "true")
    expect(codeBlock).toHaveAttribute("data-force-no-title", "true")
  })
})

describe("interactions", () => {
  test("calls setSelectedTabIndex when tab is clicked", () => {
    const mockSetSelectedTabIndex = vi.fn()
    const tabs: VerticalCodeTab[] = [
      {
        title: "Tab 1",
        code: { source: "code1", lang: "javascript" },
      },
      {
        title: "Tab 2",
        code: { source: "code2", lang: "typescript" },
      },
    ]
    const { container } = render(
      <VerticalCodeTabs
        tabs={tabs}
        selectedTabIndex={0}
        setSelectedTabIndex={mockSetSelectedTabIndex}
      />
    )
    const tabButtons = container.querySelectorAll("li")
    fireEvent.click(tabButtons[1]!)
    expect(mockSetSelectedTabIndex).toHaveBeenCalledWith(1)
  })

  test("updates selected tab styles when selectedTabIndex changes", () => {
    const tabs: VerticalCodeTab[] = [
      {
        title: "Tab 1",
        code: { source: "code1", lang: "javascript" },
      },
      {
        title: "Tab 2",
        code: { source: "code2", lang: "typescript" },
      },
    ]
    const { container, rerender } = render(
      <VerticalCodeTabs
        tabs={tabs}
        selectedTabIndex={0}
        setSelectedTabIndex={vi.fn()}
      />
    )
    let tabButtons = container.querySelectorAll("li")
    expect(tabButtons[0]).toHaveClass("text-medusa-contrast-fg-primary")
    expect(tabButtons[1]).toHaveClass("text-medusa-contrast-fg-secondary")
    rerender(
      <VerticalCodeTabs
        tabs={tabs}
        selectedTabIndex={1}
        setSelectedTabIndex={vi.fn()}
      />
    )
    tabButtons = container.querySelectorAll("li")
    expect(tabButtons[0]).toHaveClass("text-medusa-contrast-fg-secondary")
    expect(tabButtons[1]).toHaveClass("text-medusa-contrast-fg-primary")
  })
})
