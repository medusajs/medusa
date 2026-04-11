import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { fireEvent, render } from "@testing-library/react"
import { CodeBlock } from "@/components/CodeBlock"

// mock data
const mockColorMode = "light"
const mockUseColorMode = vi.fn(() => ({
  colorMode: mockColorMode,
}))

// mock hooks
const mockSelectedTab = {
  label: "Tab 1",
  value: "tab1",
  codeProps: { source: "code1" },
}
const mockChangeSelectedTab = vi.fn()
const mockUseTabs = vi.fn(() => ({
  selectedTab: mockSelectedTab,
  changeSelectedTab: mockChangeSelectedTab,
}))

// mock components
vi.mock("@/providers/ColorMode", () => ({
  useColorMode: () => mockUseColorMode(),
}))

vi.mock("@/hooks/use-tabs", () => ({
  useTabs: () => mockUseTabs(),
}))

vi.mock("@/components/Badge", () => ({
  Badge: ({
    children,
    variant,
  }: {
    children: React.ReactNode
    variant?: string
  }) => (
    <div data-testid="badge" data-variant={variant}>
      {children}
    </div>
  ),
}))

vi.mock("@/components/CodeBlock", () => ({
  CodeBlock: ({ source, hasTabs }: { source: string; hasTabs?: boolean }) => (
    <div data-testid="code-block" data-source={source} data-has-tabs={hasTabs}>
      {source}
    </div>
  ),
}))

vi.mock("@/components/CodeBlock/Actions", () => ({
  CodeBlockActions: ({ source }: { source: string }) => (
    <div data-testid="code-block-actions" data-source={source}>
      Actions
    </div>
  ),
}))

vi.mock("../Item", () => ({
  CodeTab: ({
    label,
    value,
    isSelected,
    blockStyle,
    changeSelectedTab,
    pushRef,
    children,
  }: {
    label: string
    value: string
    isSelected?: boolean
    blockStyle?: string
    changeSelectedTab?: (tab: { label: string; value: string }) => void
    pushRef?: (tabButton: HTMLButtonElement | null) => void
    children: React.ReactNode
  }) => (
    <li>
      <button
        data-testid={`code-tab-${value}`}
        data-selected={isSelected}
        data-block-style={blockStyle}
        ref={(tabButton) => pushRef?.(tabButton)}
        onClick={() => changeSelectedTab?.({ label, value })}
        aria-selected={isSelected}
        role="tab"
      >
        {label}
      </button>
      {children}
    </li>
  ),
}))

import { CodeTab } from "../Item"
import { CodeTabs } from "../../CodeTabs"

beforeEach(() => {
  mockUseColorMode.mockReturnValue({
    colorMode: mockColorMode,
  })
  mockUseTabs.mockReturnValue({
    selectedTab: mockSelectedTab,
    changeSelectedTab: mockChangeSelectedTab,
  })
  mockChangeSelectedTab.mockClear()
})

describe("rendering", () => {
  test("renders with default props", () => {
    const { container } = render(
      <CodeTabs>
        <CodeTab label="Tab 1" value="tab1">
          <CodeBlock source="console.log('test')" />
        </CodeTab>
      </CodeTabs>
    )
    const codeTabs = container.querySelector("[data-testid='code-tabs']")
    expect(codeTabs).toBeInTheDocument()
  })

  test("renders with className", () => {
    const { container } = render(
      <CodeTabs className="custom-class">
        <CodeTab label="Tab 1" value="tab1">
          <CodeBlock source="console.log('test')" />
        </CodeTab>
      </CodeTabs>
    )
    const wrapper = container.querySelector("[data-testid='code-tabs']")
    expect(wrapper).toHaveClass("custom-class")
  })

  test("renders with blockStyle loud", () => {
    const { container } = render(
      <CodeTabs blockStyle="loud">
        <CodeTab label="Tab 1" value="tab1">
          <CodeBlock source="console.log('test')" />
        </CodeTab>
      </CodeTabs>
    )
    const wrapper = container.querySelector("[data-testid='code-tabs']")
    expect(wrapper).toHaveClass("bg-medusa-contrast-bg-base")
    expect(wrapper).toHaveClass(
      "shadow-elevation-code-block dark:shadow-elevation-code-block-dark"
    )
  })

  test("renders with blockStyle subtle (light color mode)", () => {
    const { container } = render(
      <CodeTabs blockStyle="subtle">
        <CodeTab label="Tab 1" value="tab1">
          <CodeBlock source="console.log('test')" />
        </CodeTab>
      </CodeTabs>
    )
    const wrapper = container.querySelector("[data-testid='code-tabs']")
    expect(wrapper).toHaveClass("bg-medusa-bg-component")
    expect(wrapper).toHaveClass("shadow-none")
  })

  test("renders with blockStyle subtle (dark color mode)", () => {
    mockUseColorMode.mockReturnValueOnce({
      colorMode: "dark",
    })
    const { container } = render(
      <CodeTabs blockStyle="subtle">
        <CodeTab label="Tab 1" value="tab1">
          <CodeBlock source="console.log('test')" />
        </CodeTab>
      </CodeTabs>
    )
    const wrapper = container.querySelector("[data-testid='code-tabs']")
    expect(wrapper).toHaveClass("bg-medusa-code-bg-header")
    expect(wrapper).toHaveClass("shadow-none")
  })

  test("renders multiple tabs", () => {
    const { container } = render(
      <CodeTabs>
        <CodeTab label="Tab 1" value="tab1">
          <CodeBlock source="console.log('test1')" />
        </CodeTab>
        <CodeTab label="Tab 2" value="tab2">
          <CodeBlock source="console.log('test2')" />
        </CodeTab>
      </CodeTabs>
    )
    const buttons = container.querySelectorAll("button[role='tab']")
    expect(buttons.length).toBe(2)
    expect(buttons[0]).toHaveTextContent("Tab 1")
    expect(buttons[1]).toHaveTextContent("Tab 2")
  })

  test("renders selected tab code block", () => {
    mockUseTabs.mockReturnValueOnce({
      selectedTab: {
        label: "Tab 1",
        value: "tab1",
        codeProps: { source: "code1" },
        codeBlock: <CodeBlock source="code1" />,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
      changeSelectedTab: mockChangeSelectedTab,
    })
    const { container } = render(
      <CodeTabs>
        <CodeTab label="Tab 1" value="tab1">
          <CodeBlock source="code1" />
        </CodeTab>
      </CodeTabs>
    )
    const codeBlock = container.querySelector("[data-testid='code-block']")
    expect(codeBlock).toBeInTheDocument()
    expect(codeBlock).toHaveAttribute("data-source", "code1")
  })

  test("renders badge when selected tab has badgeLabel", () => {
    mockUseTabs.mockReturnValueOnce({
      selectedTab: {
        label: "Tab 1",
        value: "tab1",
        codeProps: {
          source: "code1",
          badgeLabel: "New",
          badgeColor: "green",
        },
        codeBlock: (
          <CodeBlock source="code1" badgeLabel="New" badgeColor="green" />
        ),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
      changeSelectedTab: mockChangeSelectedTab,
    })
    const { container } = render(
      <CodeTabs>
        <CodeTab label="Tab 1" value="tab1">
          <CodeBlock source="code1" badgeLabel="New" badgeColor="green" />
        </CodeTab>
      </CodeTabs>
    )
    const badge = container.querySelector("[data-testid='badge']")
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveAttribute("data-variant", "green")
    expect(badge).toHaveTextContent("New")
  })

  test("does not render badge when selected tab has no badgeLabel", () => {
    mockUseTabs.mockReturnValueOnce({
      selectedTab: {
        label: "Tab 1",
        value: "tab1",
        codeProps: { source: "code1" },
        codeBlock: <CodeBlock source="code1" />,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
      changeSelectedTab: mockChangeSelectedTab,
    })
    const { container } = render(
      <CodeTabs>
        <CodeTab label="Tab 1" value="tab1">
          <CodeBlock source="code1" />
        </CodeTab>
      </CodeTabs>
    )
    const badge = container.querySelector("[data-testid='badge']")
    expect(badge).not.toBeInTheDocument()
  })

  test("renders code block actions when selected tab exists", () => {
    mockUseTabs.mockReturnValueOnce({
      selectedTab: {
        label: "Tab 1",
        value: "tab1",
        codeProps: { source: "code1" },
        codeBlock: <CodeBlock source="code1" />,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
      changeSelectedTab: mockChangeSelectedTab,
    })
    const { container } = render(
      <CodeTabs>
        <CodeTab label="Tab 1" value="tab1">
          <CodeBlock source="code1" />
        </CodeTab>
      </CodeTabs>
    )
    const actions = container.querySelector(
      "[data-testid='code-block-actions']"
    )
    expect(actions).toBeInTheDocument()
    expect(actions).toHaveAttribute("data-source", "code1")
  })

  test("does not render code block actions when no selected tab", () => {
    mockUseTabs.mockReturnValueOnce({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      selectedTab: null as any,
      changeSelectedTab: mockChangeSelectedTab,
    })
    const { container } = render(
      <CodeTabs>
        <CodeTab label="Tab 1" value="tab1">
          <CodeBlock source="code1" />
        </CodeTab>
      </CodeTabs>
    )
    const actions = container.querySelector(
      "[data-testid='code-block-actions']"
    )
    expect(actions).not.toBeInTheDocument()
  })

  test("renders tab selector span", () => {
    const { container } = render(
      <CodeTabs>
        <CodeTab label="Tab 1" value="tab1">
          <CodeBlock source="console.log('test')" />
        </CodeTab>
      </CodeTabs>
    )
    const selector = container.querySelector("span.xs\\:absolute")
    expect(selector).toBeInTheDocument()
  })

  test("filters out invalid children", () => {
    const { container } = render(
      <CodeTabs>
        <CodeTab label="Tab 1" value="tab1">
          <CodeBlock source="code1" />
        </CodeTab>
        {null}
        <div>Invalid child</div>
        <CodeTab label="Tab 2" value="tab2">
          <CodeBlock source="code2" />
        </CodeTab>
      </CodeTabs>
    )
    const buttons = container.querySelectorAll("button[role='tab']")
    expect(buttons.length).toBe(2)
  })
})

describe("tab selection", () => {
  test("calls changeSelectedTab when tab is clicked", () => {
    const { container } = render(
      <CodeTabs>
        <CodeTab label="Tab 1" value="tab1">
          <CodeBlock source="code1" />
        </CodeTab>
        <CodeTab label="Tab 2" value="tab2">
          <CodeBlock source="code2" />
        </CodeTab>
      </CodeTabs>
    )
    const buttons = container.querySelectorAll("button[role='tab']")
    fireEvent.click(buttons[1]!)
    expect(mockChangeSelectedTab).toHaveBeenCalledWith({
      label: "Tab 2",
      value: "tab2",
    })
  })

  test("marks first tab as selected when no selectedTab", () => {
    mockUseTabs.mockReturnValueOnce({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      selectedTab: null as any,
      changeSelectedTab: mockChangeSelectedTab,
    })
    const { container } = render(
      <CodeTabs>
        <CodeTab label="Tab 1" value="tab1">
          <CodeBlock source="code1" />
        </CodeTab>
        <CodeTab label="Tab 2" value="tab2">
          <CodeBlock source="code2" />
        </CodeTab>
      </CodeTabs>
    )
    const buttons = container.querySelectorAll("button[role='tab']")
    expect(buttons[0]).toHaveAttribute("aria-selected", "true")
    expect(buttons[1]).toHaveAttribute("aria-selected", "false")
  })

  test("marks correct tab as selected based on selectedTab value", () => {
    mockUseTabs.mockReturnValueOnce({
      selectedTab: {
        label: "Tab 2",
        value: "tab2",
        codeProps: { source: "code2" },
        codeBlock: <CodeBlock source="code2" />,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
      changeSelectedTab: mockChangeSelectedTab,
    })
    const { container } = render(
      <CodeTabs>
        <CodeTab label="Tab 1" value="tab1">
          <CodeBlock source="code1" />
        </CodeTab>
        <CodeTab label="Tab 2" value="tab2">
          <CodeBlock source="code2" />
        </CodeTab>
      </CodeTabs>
    )
    const buttons = container.querySelectorAll("button[role='tab']")
    expect(buttons[0]).toHaveAttribute("aria-selected", "false")
    expect(buttons[1]).toHaveAttribute("aria-selected", "true")
  })
})
