import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { fireEvent, render, waitFor } from "@testing-library/react"
import { TooltipProps } from "../../Tooltip"

// mock functions
const mockHandleCopy = vi.fn()
const defaultUseCopyReturn = {
  isCopied: false,
  handleCopy: mockHandleCopy,
}
const mockUseCopy = vi.fn(() => defaultUseCopyReturn)
const mockOnCopy = vi.fn()
// mock components
vi.mock("@/components/Tooltip", () => ({
  Tooltip: ({
    children,
    text,
    tooltipClassName,
    innerClassName,
  }: TooltipProps) => (
    <div
      data-testid="tooltip"
      data-text={text}
      data-tooltip-class-name={tooltipClassName}
      data-inner-class-name={innerClassName}
    >
      {children}
    </div>
  ),
}))
vi.mock("@/hooks/use-copy", () => ({
  useCopy: () => mockUseCopy(),
}))

import { CopyButton } from "../index"

beforeEach(() => {
  vi.clearAllMocks()
})

describe("render", () => {
  test("renders copy button", () => {
    const { container } = render(<CopyButton text="Copy to Clipboard" />)
    const copyButton = container.querySelector("[data-testid='copy-button']")
    expect(copyButton).toBeInTheDocument()
    const tooltip = container.querySelector("[data-testid='tooltip']")
    expect(tooltip).toBeInTheDocument()
    expect(tooltip).toHaveAttribute("data-text", "Copy to Clipboard")
  })

  test("renders copy button with tooltip text", () => {
    const { container } = render(
      <CopyButton text="Copy to Clipboard" tooltipText="Custom Copy" />
    )
    const copyButton = container.querySelector("[data-testid='copy-button']")
    expect(copyButton).toBeInTheDocument()
    const tooltip = container.querySelector("[data-testid='tooltip']")
    expect(tooltip).toBeInTheDocument()
    expect(tooltip).toHaveAttribute("data-text", "Custom Copy")
  })

  test("renders copy button with tooltip class name", () => {
    const { container } = render(
      <CopyButton text="Copy to Clipboard" tooltipClassName="custom-tooltip" />
    )
    const copyButton = container.querySelector("[data-testid='copy-button']")
    expect(copyButton).toBeInTheDocument()
    const tooltip = container.querySelector("[data-testid='tooltip']")
    expect(tooltip).toBeInTheDocument()
    expect(tooltip).toHaveAttribute("data-tooltip-class-name", "custom-tooltip")
  })

  test("renders copy button with tooltip inner class name", () => {
    const { container } = render(
      <CopyButton
        text="Copy to Clipboard"
        tooltipInnerClassName="custom-tooltip-inner"
      />
    )
    const copyButton = container.querySelector("[data-testid='copy-button']")
    expect(copyButton).toBeInTheDocument()
    const tooltip = container.querySelector("[data-testid='tooltip']")
    expect(tooltip).toBeInTheDocument()
    expect(tooltip).toHaveAttribute(
      "data-inner-class-name",
      "custom-tooltip-inner"
    )
  })

  test("renders copy button with button class name", () => {
    const { container } = render(
      <CopyButton text="Copy to Clipboard" buttonClassName="custom-button" />
    )
    const copyButton = container.querySelector("[data-testid='copy-button']")
    expect(copyButton).toBeInTheDocument()
    expect(copyButton).toHaveClass("custom-button")
  })

  test("renders copy button with handleTouch", () => {
    const { container } = render(
      <CopyButton text="Copy to Clipboard" handleTouch />
    )
    const copyButton = container.querySelector("[data-testid='copy-button']")
    expect(copyButton).toBeInTheDocument()
    const tooltip = container.querySelector("[data-testid='tooltip']")
    expect(tooltip).toBeInTheDocument()
    expect(tooltip).toHaveAttribute("data-tooltip-class-name", "!block")
  })

  test("tooltip text changes to 'Copied!' when isCopied is true", () => {
    mockUseCopy.mockReturnValue({
      ...defaultUseCopyReturn,
      isCopied: true,
    })
    const { container } = render(<CopyButton text="Copy to Clipboard" />)
    const tooltip = container.querySelector("[data-testid='tooltip']")
    expect(tooltip).toBeInTheDocument()
    expect(tooltip).toHaveAttribute("data-text", "Copied!")
  })
})

describe("interactions", () => {
  test("calls handleCopy when copy button is clicked", () => {
    const { container } = render(<CopyButton text="Copy to Clipboard" />)
    const copyButton = container.querySelector("[data-testid='copy-button']")
    expect(copyButton).toBeInTheDocument()
    fireEvent.click(copyButton!)
    expect(mockHandleCopy).toHaveBeenCalled()
  })

  test("calls handleCopy when copy button is clicked with handleTouch", () => {
    const { container } = render(
      <CopyButton text="Copy to Clipboard" handleTouch />
    )
    const copyButton = container.querySelector("[data-testid='copy-button']")
    expect(copyButton).toBeInTheDocument()
    fireEvent.click(copyButton!)
    expect(mockHandleCopy).toHaveBeenCalled()
  })

  test("doesn't call handleCopy when copy button is touched then clicked, with handleTouch", async () => {
    const { container } = render(
      <CopyButton text="Copy to Clipboard" handleTouch />
    )
    const copyButton = container.querySelector("[data-testid='copy-button']")
    expect(copyButton).toBeInTheDocument()
    fireEvent.touchEnd(copyButton!)
    fireEvent.click(copyButton!)
    expect(mockHandleCopy).toHaveBeenCalledTimes(0)
  })

  test("doesn't call handleCopy when button is touched and handleTouch is true and touchCount is 0", () => {
    const { container } = render(
      <CopyButton text="Copy to Clipboard" handleTouch />
    )
    const copyButton = container.querySelector("[data-testid='copy-button']")
    expect(copyButton).toBeInTheDocument()
    fireEvent.touchEnd(copyButton!)
    expect(mockHandleCopy).not.toHaveBeenCalled()
  })

  test("calls handleCopy when button is touched and handleTouch is true and touchCount is 1", () => {
    const { container } = render(
      <CopyButton text="Copy to Clipboard" handleTouch />
    )
    const copyButton = container.querySelector("[data-testid='copy-button']")
    expect(copyButton).toBeInTheDocument()
    fireEvent.touchEnd(copyButton!)
    expect(mockHandleCopy).not.toHaveBeenCalled()
    fireEvent.touchEnd(copyButton!)
    expect(mockHandleCopy).toHaveBeenCalled()
  })

  test("calls onCopy when copy button is clicked", () => {
    const { container } = render(
      <CopyButton text="Copy to Clipboard" onCopy={mockOnCopy} />
    )
    const copyButton = container.querySelector("[data-testid='copy-button']")
    expect(copyButton).toBeInTheDocument()
    fireEvent.click(copyButton!)
    expect(mockOnCopy).toHaveBeenCalled()
  })

  test("calls onCopy when button is touched and handleTouch is true and touchCount is 1", () => {
    const { container } = render(
      <CopyButton text="Copy to Clipboard" handleTouch onCopy={mockOnCopy} />
    )
    const copyButton = container.querySelector("[data-testid='copy-button']")
    expect(copyButton).toBeInTheDocument()
    fireEvent.touchEnd(copyButton!)
    expect(mockOnCopy).not.toHaveBeenCalled()
    fireEvent.touchEnd(copyButton!)
    expect(mockOnCopy).toHaveBeenCalled()
  })
})
