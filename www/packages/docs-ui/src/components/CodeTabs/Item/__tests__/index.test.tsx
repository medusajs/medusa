import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { fireEvent, render } from "@testing-library/react"

// mock data
const mockLabel = "Code Tab"
const mockValue = "code-tab"
const mockColorMode = "light"

// mock functions
const mockChangeSelectedTab = vi.fn()
const mockPushRef = vi.fn()
const mockUseColorMode = vi.fn(() => ({
  colorMode: mockColorMode,
}))
const mockUseScrollPositionBlocker = vi.fn(() => ({
  blockElementScrollPositionUntilNextRender: vi.fn(),
}))

// mock components and hooks
vi.mock("@/providers/ColorMode", () => ({
  useColorMode: () => mockUseColorMode(),
}))
vi.mock("@/hooks/use-scroll-utils", () => ({
  useScrollPositionBlocker: () => mockUseScrollPositionBlocker(),
}))

import { CodeTab } from "../../Item"

beforeEach(() => {
  mockUseColorMode.mockReturnValue({
    colorMode: mockColorMode,
  })
  mockUseScrollPositionBlocker.mockReturnValue({
    blockElementScrollPositionUntilNextRender: vi.fn(),
  })
})

describe("render", () => {
  test("default render (loud blockStyle, not selected, light color mode)", () => {
    const { container } = render(
      <CodeTab label={mockLabel} value={mockValue}>
        <div data-testid="children">Children</div>
      </CodeTab>
    )
    expect(container).toBeInTheDocument()
    const button = container.querySelector("button")
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent(mockLabel)
    expect(button).toHaveAttribute("aria-selected", "false")
    expect(button).toHaveAttribute("role", "tab")
    expect(button).toHaveClass("text-medusa-contrast-fg-secondary")
    expect(button).not.toHaveClass("text-medusa-contrast-fg-primary")
    expect(button).not.toHaveClass("xs:border-medusa-border-base")
    expect(button).not.toHaveClass("xs:border-medusa-code-border")
    expect(button).not.toHaveClass("text-medusa-contrast-fg-primary")
    expect(button).not.toHaveClass("xs:border-medusa-border-base")
    expect(button).not.toHaveClass("xs:border-medusa-code-border")
    expect(button).not.toHaveClass("text-medusa-contrast-fg-primary")
    expect(button).not.toHaveClass("xs:border-medusa-border-base")
    expect(button).not.toHaveClass("xs:border-medusa-code-border")
  })

  test("render with selected (loud blockStyle, light color mode)", () => {
    const { container } = render(
      <CodeTab label={mockLabel} value={mockValue} isSelected={true}>
        <div data-testid="children">Children</div>
      </CodeTab>
    )
    expect(container).toBeInTheDocument()
    const button = container.querySelector("button")
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent(mockLabel)
    expect(button).toHaveAttribute("aria-selected", "true")
    expect(button).toHaveAttribute("role", "tab")
    expect(button).toHaveClass("text-medusa-contrast-fg-primary")
    expect(button).not.toHaveClass("text-medusa-contrast-fg-secondary")
    expect(button).not.toHaveClass("xs:border-medusa-border-base")
    expect(button).not.toHaveClass("xs:border-medusa-code-border")
  })

  test("render with subtle blockStyle (not selected, light color mode)", () => {
    const { container } = render(
      <CodeTab label={mockLabel} value={mockValue} blockStyle="subtle">
        <div data-testid="children">Children</div>
      </CodeTab>
    )
    expect(container).toBeInTheDocument()
    const button = container.querySelector("button")
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent(mockLabel)
    expect(button).toHaveAttribute("aria-selected", "false")
    expect(button).toHaveAttribute("role", "tab")
    expect(button).toHaveClass("text-medusa-fg-subtle hover:bg-medusa-bg-base")
    expect(button).not.toHaveClass("text-medusa-contrast-fg-secondary")
    expect(button).not.toHaveClass("xs:border-medusa-code-border")
    expect(button).not.toHaveClass("text-medusa-contrast-fg-primary")
    expect(button).not.toHaveClass("hover:bg-medusa-code-bg-base")
  })

  test("render with subtle blockStyle and dark color mode", () => {
    mockUseColorMode.mockReturnValue({
      colorMode: "dark",
    })
    const { container } = render(
      <CodeTab label={mockLabel} value={mockValue} blockStyle="subtle">
        <div data-testid="children">Children</div>
      </CodeTab>
    )
    expect(container).toBeInTheDocument()
    const button = container.querySelector("button")
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent(mockLabel)
    expect(button).toHaveAttribute("aria-selected", "false")
    expect(button).toHaveAttribute("role", "tab")
    expect(button).toHaveClass("text-medusa-contrast-fg-secondary")
    expect(button).not.toHaveClass("text-medusa-contrast-fg-primary")
    expect(button).not.toHaveClass("xs:border-medusa-border-base")
    expect(button).not.toHaveClass("xs:border-medusa-code-border")
    expect(button).not.toHaveClass("text-medusa-contrast-fg-primary")
    expect(button).not.toHaveClass("xs:border-medusa-border-base")
    expect(button).not.toHaveClass("xs:border-medusa-code-border")
    expect(button).not.toHaveClass("text-medusa-contrast-fg-primary")
    expect(button).not.toHaveClass("xs:border-medusa-border-base")
    expect(button).not.toHaveClass("xs:border-medusa-code-border")
  })

  test("render with subtle blockStyle and selected (light color mode)", () => {
    const { container } = render(
      <CodeTab
        label={mockLabel}
        value={mockValue}
        blockStyle="subtle"
        isSelected={true}
      >
        <div data-testid="children">Children</div>
      </CodeTab>
    )
    expect(container).toBeInTheDocument()
    const button = container.querySelector("button")
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent(mockLabel)
    expect(button).toHaveAttribute("aria-selected", "true")
    expect(button).toHaveAttribute("role", "tab")
    expect(button).toHaveClass(
      "xs:border-medusa-border-base text-medusa-contrast-fg-primary"
    )
    expect(button).not.toHaveClass("text-medusa-contrast-fg-secondary")
    expect(button).not.toHaveClass("hover:bg-medusa-code-bg-base")
    expect(button).not.toHaveClass("text-medusa-contrast-fg-secondary")
  })

  test("render with subtle blockStyle and dark color mode and selected", () => {
    mockUseColorMode.mockReturnValue({
      colorMode: "dark",
    })
    const { container } = render(
      <CodeTab
        label={mockLabel}
        value={mockValue}
        blockStyle="subtle"
        isSelected={true}
      >
        <div data-testid="children">Children</div>
      </CodeTab>
    )
    expect(container).toBeInTheDocument()
    const button = container.querySelector("button")
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent(mockLabel)
    expect(button).toHaveAttribute("aria-selected", "true")
    expect(button).toHaveAttribute("role", "tab")
    expect(button).toHaveClass(
      "xs:border-medusa-code-border text-medusa-contrast-fg-primary"
    )
    expect(button).not.toHaveClass("text-medusa-contrast-fg-secondary")
    expect(button).not.toHaveClass("hover:bg-medusa-code-bg-base")
    expect(button).not.toHaveClass("text-medusa-contrast-fg-secondary")
  })

  test("render with loud blockStyle and not selected and dark color mode", () => {
    mockUseColorMode.mockReturnValue({
      colorMode: "dark",
    })
    const { container } = render(
      <CodeTab label={mockLabel} value={mockValue} blockStyle="loud">
        <div data-testid="children">Children</div>
      </CodeTab>
    )
    expect(container).toBeInTheDocument()
    const button = container.querySelector("button")
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent(mockLabel)
    expect(button).toHaveAttribute("aria-selected", "false")
    expect(button).toHaveAttribute("role", "tab")
    expect(button).toHaveClass("text-medusa-contrast-fg-secondary")
    expect(button).not.toHaveClass("text-medusa-contrast-fg-primary")
    expect(button).not.toHaveClass("xs:border-medusa-border-base")
    expect(button).not.toHaveClass("xs:border-medusa-code-border")
    expect(button).not.toHaveClass("text-medusa-contrast-fg-primary")
    expect(button).not.toHaveClass("xs:border-medusa-border-base")
    expect(button).not.toHaveClass("xs:border-medusa-code-border")
    expect(button).not.toHaveClass("text-medusa-contrast-fg-primary")
    expect(button).not.toHaveClass("xs:border-medusa-border-base")
    expect(button).not.toHaveClass("xs:border-medusa-code-border")
  })

  test("render with pushRef", () => {
    const { container } = render(
      <CodeTab label={mockLabel} value={mockValue} pushRef={mockPushRef}>
        <div data-testid="children">Children</div>
      </CodeTab>
    )
    expect(container).toBeInTheDocument()
    const button = container.querySelector("button")
    expect(button).toBeInTheDocument()
    expect(mockPushRef).toHaveBeenCalledWith(button)
  })
})

describe("interactions", () => {
  test("click on tab without changeSelectedTab", () => {
    const { container } = render(
      <CodeTab label={mockLabel} value={mockValue}>
        <div data-testid="children">Children</div>
      </CodeTab>
    )
    expect(container).toBeInTheDocument()
    const button = container.querySelector("button")
    expect(button).toBeInTheDocument()

    fireEvent.click(button!)
    expect(
      mockUseScrollPositionBlocker().blockElementScrollPositionUntilNextRender
    ).toHaveBeenCalled()
    expect(mockChangeSelectedTab).not.toHaveBeenCalled()
  })

  test("click on tab with changeSelectedTab", () => {
    const { container } = render(
      <CodeTab
        label={mockLabel}
        value={mockValue}
        changeSelectedTab={mockChangeSelectedTab}
      >
        <div data-testid="children">Children</div>
      </CodeTab>
    )
    expect(container).toBeInTheDocument()
    const button = container.querySelector("button")
    expect(button).toBeInTheDocument()
    fireEvent.click(button!)
    expect(
      mockUseScrollPositionBlocker().blockElementScrollPositionUntilNextRender
    ).toHaveBeenCalled()
    expect(mockChangeSelectedTab).toHaveBeenCalledWith({
      label: mockLabel,
      value: mockValue,
    })
  })
})
