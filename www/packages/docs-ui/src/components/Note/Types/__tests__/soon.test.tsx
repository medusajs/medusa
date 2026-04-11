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

import { SoonNote } from "../soon"

beforeEach(() => {
  vi.clearAllMocks()
})

describe("rendering", () => {
  test("renders with default title", () => {
    const { container } = render(<SoonNote>Content</SoonNote>)
    const layout = container.querySelector("[data-testid='note-layout']")
    expect(layout).toHaveAttribute("data-title", "Coming soon")
  })

  test("renders with custom title", () => {
    const { container } = render(
      <SoonNote title="Custom Soon">Content</SoonNote>
    )
    const layout = container.querySelector("[data-testid='note-layout']")
    expect(layout).toHaveAttribute("data-title", "Custom Soon")
  })

  test("renders children", () => {
    const { container } = render(<SoonNote>Soon Content</SoonNote>)
    expect(container).toHaveTextContent("Soon Content")
  })
})
