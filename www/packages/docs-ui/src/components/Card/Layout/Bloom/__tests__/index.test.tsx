import React from "react"
import { describe, expect, test, vi } from "vitest"
import { fireEvent, render } from "@testing-library/react"

// mock components
vi.mock("@/components/Link", () => ({
  Link: ({ children, ...props }: React.ComponentProps<"a">) => (
    <a {...props}>{children}</a>
  ),
}))
vi.mock("@/components/Icons", () => ({
  BloomIcon: () => <span data-testid="bloom-icon">BloomIcon</span>,
}))
vi.mock("@medusajs/icons", () => ({
  TriangleRightMini: (props: React.ComponentProps<"svg">) => (
    <svg {...props} data-testid="triangle-right-mini" />
  ),
}))

import { CardBloomLayout } from "../index"

describe("rendering", () => {
  test("renders card with title and text", () => {
    const { container } = render(
      <CardBloomLayout title="Test Title" text="Test Text" />
    )
    expect(container).toBeInTheDocument()
    const title = container.querySelector("[data-testid='title']")
    expect(title).toBeInTheDocument()
    expect(title).toHaveTextContent("Test Title")
    const text = container.querySelector("[data-testid='text']")
    expect(text).toBeInTheDocument()
    expect(text).toHaveTextContent("Test Text")
    const bloomIcon = container.querySelector("[data-testid='bloom-icon']")
    expect(bloomIcon).toBeInTheDocument()
    const triangleIcon = container.querySelector(
      "[data-testid='triangle-right-mini']"
    )
    expect(triangleIcon).toBeInTheDocument()
  })

  test("renders card with href", () => {
    const { container } = render(
      <CardBloomLayout
        title="Test Title"
        text="Test Text"
        href="/test-link"
      />
    )
    expect(container).toBeInTheDocument()
    const link = container.querySelector("a")
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute("href", "/test-link")
    expect(link).toHaveAttribute("aria-label", "Test Title")
  })

  test("renders card without href", () => {
    const { container } = render(
      <CardBloomLayout title="Test Title" text="Test Text" />
    )
    expect(container).toBeInTheDocument()
    const link = container.querySelector("a")
    expect(link).not.toBeInTheDocument()
  })

  test("renders card with children", () => {
    const { container } = render(
      <CardBloomLayout title="Test Title">
        <span>Child content</span>
      </CardBloomLayout>
    )
    expect(container).toBeInTheDocument()
    expect(container).toHaveTextContent("Child content")
  })

  test("renders card with custom className", () => {
    const { container } = render(
      <CardBloomLayout title="Test Title" className="custom-class" />
    )
    expect(container).toBeInTheDocument()
    const wrapper = container.querySelector("div")
    expect(wrapper).toHaveClass("custom-class")
  })

  test("renders card with custom contentClassName", () => {
    const { container } = render(
      <CardBloomLayout
        title="Test Title"
        contentClassName="custom-content-class"
      />
    )
    expect(container).toBeInTheDocument()
    const content = container.querySelector(".custom-content-class")
    expect(content).toBeInTheDocument()
  })
})

describe("interactions", () => {
  test("calls onClick when card is clicked", () => {
    const mockOnClick = vi.fn()
    const { container } = render(
      <CardBloomLayout
        title="Test Title"
        href="/test-link"
        onClick={mockOnClick}
      />
    )
    expect(container).toBeInTheDocument()
    const link = container.querySelector("a")
    expect(link).toBeInTheDocument()
    fireEvent.click(link!)
    expect(mockOnClick).toHaveBeenCalledTimes(1)
  })
})
