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

import { SuccessNote } from "../sucess"

beforeEach(() => {
  vi.clearAllMocks()
})

describe("rendering", () => {
  test("renders with default title", () => {
    const { container } = render(<SuccessNote>Content</SuccessNote>)
    const layout = container.querySelector("[data-testid='note-layout']")
    expect(layout).toHaveAttribute("data-title", "Sucess")
  })

  test("renders with custom title", () => {
    const { container } = render(
      <SuccessNote title="Custom Success">Content</SuccessNote>
    )
    const layout = container.querySelector("[data-testid='note-layout']")
    expect(layout).toHaveAttribute("data-title", "Custom Success")
  })

  test("renders children", () => {
    const { container } = render(<SuccessNote>Success Content</SuccessNote>)
    expect(container).toHaveTextContent("Success Content")
  })
})
