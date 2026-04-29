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

import { CheckNote } from "../checks"

beforeEach(() => {
  vi.clearAllMocks()
})

describe("rendering", () => {
  test("renders with default title", () => {
    const { container } = render(<CheckNote>Content</CheckNote>)
    const layout = container.querySelector("[data-testid='note-layout']")
    expect(layout).toHaveAttribute("data-title", "Prerequisites")
  })

  test("renders with custom title", () => {
    const { container } = render(
      <CheckNote title="Custom Prerequisites">Content</CheckNote>
    )
    const layout = container.querySelector("[data-testid='note-layout']")
    expect(layout).toHaveAttribute("data-title", "Custom Prerequisites")
  })

  test("renders children", () => {
    const { container } = render(<CheckNote>Check Content</CheckNote>)
    expect(container).toHaveTextContent("Check Content")
  })
})
