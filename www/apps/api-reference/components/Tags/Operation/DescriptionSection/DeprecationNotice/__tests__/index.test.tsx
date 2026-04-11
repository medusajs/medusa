import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { cleanup, render } from "@testing-library/react"

// mock data
const mockDeprecationMessage = "This operation is deprecated"

// mock components
vi.mock("docs-ui", () => ({
  Badge: ({ variant, children }: { variant: string, children: React.ReactNode }) => (
    <div data-testid="badge" data-variant={variant}>{children}</div>
  ),
  Tooltip: ({ text, children }: { text: string, children: React.ReactNode }) => (
    <div data-testid="tooltip" data-text={text}>{children}</div>
  ),
}))

import TagsOperationDescriptionSectionDeprecationNotice from ".."

beforeEach(() => {
  vi.clearAllMocks()
  cleanup()
})

describe("rendering", () => {
  test("renders deprecation notice with tooltip", () => {
    const { getByTestId } = render(
      <TagsOperationDescriptionSectionDeprecationNotice deprecationMessage={mockDeprecationMessage} />
    )
    const badgeElement = getByTestId("badge")
    expect(badgeElement).toBeInTheDocument()
    expect(badgeElement).toHaveTextContent("deprecated")
    expect(badgeElement).toHaveAttribute("data-variant", "orange")
    const tooltipElement = getByTestId("tooltip")
    expect(tooltipElement).toBeInTheDocument()
    expect(tooltipElement).toHaveAttribute("data-text", mockDeprecationMessage)
  })

  test("doesn't render tooltip when no deprecation message is available", () => {
    const { container } = render(
      <TagsOperationDescriptionSectionDeprecationNotice />
    )
    const tooltipElement = container.querySelector("[data-testid='tooltip']")
    expect(tooltipElement).not.toBeInTheDocument()
  })

  test("renders deprecation notice with className", () => {
    const { getByTestId } = render(
      <TagsOperationDescriptionSectionDeprecationNotice deprecationMessage={mockDeprecationMessage} className="test-class" />
    )
    const deprecationNoticeElement = getByTestId("deprecation-notice")
    expect(deprecationNoticeElement).toHaveClass("test-class")
  })
})