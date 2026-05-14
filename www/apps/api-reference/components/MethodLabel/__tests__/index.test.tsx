import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { cleanup, render } from "@testing-library/react"

// mock data
const mockMethod = "get"
const mockMethod2 = "post"
const mockMethod3 = "delete"

// mock components
vi.mock("docs-ui", () => ({
  Badge: ({ 
    children, 
    variant, 
    className
  }: { 
    children: React.ReactNode, 
    variant: string, 
    className: string
  }) => (
    <div data-testid="badge" data-variant={variant} className={className}>{children}</div>
  ),
  capitalize: vi.fn((text: string) => text.charAt(0).toUpperCase() + text.slice(1)),
}))

import MethodLabel from ".."

beforeEach(() => {
  vi.clearAllMocks()
  cleanup()
})

describe("rendering", () => {
  test("renders method label for get method", () => {
    const { getByTestId } = render(<MethodLabel method={mockMethod} />)
    const badgeElement = getByTestId("badge")
    expect(badgeElement).toBeInTheDocument()
    expect(badgeElement).toHaveTextContent("Get")
    expect(badgeElement).toHaveAttribute("data-variant", "green")
  })
  test("renders method label for post method", () => {
    const { getByTestId } = render(<MethodLabel method={mockMethod2} />)
    const badgeElement = getByTestId("badge")
    expect(badgeElement).toBeInTheDocument()
    expect(badgeElement).toHaveTextContent("Post")
    expect(badgeElement).toHaveAttribute("data-variant", "blue")
  })
  test("renders method label for delete method", () => {
    const { getByTestId } = render(<MethodLabel method={mockMethod3} />)
    const badgeElement = getByTestId("badge")
    expect(badgeElement).toBeInTheDocument()
    expect(badgeElement).toHaveTextContent("Del")
    expect(badgeElement).toHaveAttribute("data-variant", "red")
  })
  test("renders method label with className", () => {
    const { getByTestId } = render(<MethodLabel method={mockMethod} className="test-class" />)
    const badgeElement = getByTestId("badge")
    expect(badgeElement).toBeInTheDocument()
    expect(badgeElement).toHaveTextContent("Get")
    expect(badgeElement).toHaveAttribute("data-variant", "green")
    expect(badgeElement).toHaveClass("test-class")
  })
})