import React from "react"
import { describe, expect, test, vi } from "vitest"
import { render } from "@testing-library/react"

// mock functions
const mockSetCollapsed = vi.fn()

import { CodeBlockCollapsibleButton } from "../../Button"

describe("render", () => {
  test("render collapsible button start and collapsed", () => {
    const { container } = render(
      <CodeBlockCollapsibleButton
        type="start"
        collapsed={true}
        setCollapsed={mockSetCollapsed}
        expandButtonLabel="Show imports"
      />
    )
    expect(container).toBeInTheDocument()
    const button = container.querySelector(
      "[data-testid='collapsible-button-start']"
    )
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent("Show imports")
  })
  test("render collapsible button end and collapsed", () => {
    const { container } = render(
      <CodeBlockCollapsibleButton
        type="end"
        collapsed={true}
        setCollapsed={mockSetCollapsed}
        expandButtonLabel="Show imports"
      />
    )
    expect(container).toBeInTheDocument()
    const button = container.querySelector(
      "[data-testid='collapsible-button-end']"
    )
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent("Show imports")
  })
  test("render when not collapsed", () => {
    const { container } = render(
      <CodeBlockCollapsibleButton
        type="start"
        collapsed={false}
        setCollapsed={mockSetCollapsed}
        expandButtonLabel="Show imports"
      />
    )
    expect(container).toBeInTheDocument()
    const button = container.querySelector(
      "[data-testid='collapsible-button-start']"
    )
    expect(button).not.toBeInTheDocument()
    const buttonEnd = container.querySelector(
      "[data-testid='collapsible-button-end']"
    )
    expect(buttonEnd).not.toBeInTheDocument()
  })
  test("render with type start and className", () => {
    const { container } = render(
      <CodeBlockCollapsibleButton
        type="start"
        collapsed={true}
        setCollapsed={mockSetCollapsed}
        expandButtonLabel="Show imports"
        className="bg-red-500"
      />
    )
    expect(container).toBeInTheDocument()
    const button = container.querySelector(
      "[data-testid='collapsible-button-start']"
    )
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass("bg-red-500")
  })
  test("render with type end and className", () => {
    const { container } = render(
      <CodeBlockCollapsibleButton
        type="end"
        collapsed={true}
        setCollapsed={mockSetCollapsed}
        expandButtonLabel="Show imports"
        className="bg-red-500"
      />
    )
    expect(container).toBeInTheDocument()
    const button = container.querySelector(
      "[data-testid='collapsible-button-end']"
    )
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass("bg-red-500")
  })
})
