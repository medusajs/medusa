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

import { WarningNote } from "../warning"

beforeEach(() => {
  vi.clearAllMocks()
})

describe("rendering", () => {
  test("renders with default title", () => {
    const { container } = render(<WarningNote>Content</WarningNote>)
    const layout = container.querySelector("[data-testid='note-layout']")
    expect(layout).toHaveAttribute("data-title", "Warning")
  })

  test("renders with custom title", () => {
    const { container } = render(
      <WarningNote title="Custom Warning">Content</WarningNote>
    )
    const layout = container.querySelector("[data-testid='note-layout']")
    expect(layout).toHaveAttribute("data-title", "Custom Warning")
  })

  test("renders children", () => {
    const { container } = render(<WarningNote>Warning Content</WarningNote>)
    expect(container).toHaveTextContent("Warning Content")
  })
})
