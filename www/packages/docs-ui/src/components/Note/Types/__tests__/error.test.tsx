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

import { ErrorNote } from "../error"

beforeEach(() => {
  vi.clearAllMocks()
})

describe("rendering", () => {
  test("renders with default title", () => {
    const { container } = render(<ErrorNote>Content</ErrorNote>)
    const layout = container.querySelector("[data-testid='note-layout']")
    expect(layout).toHaveAttribute("data-title", "Error")
  })

  test("renders with custom title", () => {
    const { container } = render(
      <ErrorNote title="Custom Error">Content</ErrorNote>
    )
    const layout = container.querySelector("[data-testid='note-layout']")
    expect(layout).toHaveAttribute("data-title", "Custom Error")
  })

  test("renders children", () => {
    const { container } = render(<ErrorNote>Error Content</ErrorNote>)
    expect(container).toHaveTextContent("Error Content")
  })
})
