import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { render } from "@testing-library/react"

// mock components
vi.mock("@/components/Note/Layout", () => ({
  NoteLayout: ({
    title,
    children,
  }: {
    title?: string
    children?: React.ReactNode
  }) => (
    <div data-testid="note-layout" data-title={title}>
      {children}
    </div>
  ),
}))

import { DefaultNote } from "../default"

beforeEach(() => {
  vi.clearAllMocks()
})

describe("rendering", () => {
  test("renders with default title", () => {
    const { container } = render(<DefaultNote>Content</DefaultNote>)
    const layout = container.querySelector("[data-testid='note-layout']")
    expect(layout).toHaveAttribute("data-title", "Note")
  })

  test("renders with custom title", () => {
    const { container } = render(
      <DefaultNote title="Custom">Content</DefaultNote>
    )
    const layout = container.querySelector("[data-testid='note-layout']")
    expect(layout).toHaveAttribute("data-title", "Custom")
  })

  test("renders children", () => {
    const { container } = render(<DefaultNote>Test Content</DefaultNote>)
    expect(container).toHaveTextContent("Test Content")
  })
})
