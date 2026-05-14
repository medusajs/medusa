import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { render } from "@testing-library/react"

// mock components
vi.mock("@/components/Note/Types/default", () => ({
  DefaultNote: ({
    children,
    title,
  }: {
    children?: React.ReactNode
    title?: string
  }) => (
    <div data-testid="default-note" data-title={title}>
      {children}
    </div>
  ),
}))

vi.mock("@/components/Note/Types/warning", () => ({
  WarningNote: ({
    children,
    title,
  }: {
    children?: React.ReactNode
    title?: string
  }) => (
    <div data-testid="warning-note" data-title={title}>
      {children}
    </div>
  ),
}))

vi.mock("@/components/Note/Types/sucess", () => ({
  SuccessNote: ({
    children,
    title,
  }: {
    children?: React.ReactNode
    title?: string
  }) => (
    <div data-testid="success-note" data-title={title}>
      {children}
    </div>
  ),
}))

vi.mock("@/components/Note/Types/error", () => ({
  ErrorNote: ({
    children,
    title,
  }: {
    children?: React.ReactNode
    title?: string
  }) => (
    <div data-testid="error-note" data-title={title}>
      {children}
    </div>
  ),
}))

vi.mock("@/components/Note/Types/checks", () => ({
  CheckNote: ({
    children,
    title,
  }: {
    children?: React.ReactNode
    title?: string
  }) => (
    <div data-testid="check-note" data-title={title}>
      {children}
    </div>
  ),
}))

vi.mock("@/components/Note/Types/soon", () => ({
  SoonNote: ({
    children,
    title,
  }: {
    children?: React.ReactNode
    title?: string
  }) => (
    <div data-testid="soon-note" data-title={title}>
      {children}
    </div>
  ),
}))

import { Note } from "../../Note"

beforeEach(() => {
  vi.clearAllMocks()
})

describe("rendering", () => {
  test("renders default note by default", () => {
    const { container } = render(<Note>Content</Note>)
    const defaultNote = container.querySelector("[data-testid='default-note']")
    expect(defaultNote).toBeInTheDocument()
  })

  test("renders default note when type is default", () => {
    const { container } = render(<Note type="default">Content</Note>)
    const defaultNote = container.querySelector("[data-testid='default-note']")
    expect(defaultNote).toBeInTheDocument()
  })

  test("renders warning note when type is warning", () => {
    const { container } = render(<Note type="warning">Content</Note>)
    const warningNote = container.querySelector("[data-testid='warning-note']")
    expect(warningNote).toBeInTheDocument()
  })

  test("renders success note when type is success", () => {
    const { container } = render(<Note type="success">Content</Note>)
    const successNote = container.querySelector("[data-testid='success-note']")
    expect(successNote).toBeInTheDocument()
  })

  test("renders error note when type is error", () => {
    const { container } = render(<Note type="error">Content</Note>)
    const errorNote = container.querySelector("[data-testid='error-note']")
    expect(errorNote).toBeInTheDocument()
  })

  test("renders check note when type is check", () => {
    const { container } = render(<Note type="check">Content</Note>)
    const checkNote = container.querySelector("[data-testid='check-note']")
    expect(checkNote).toBeInTheDocument()
  })

  test("renders soon note when type is soon", () => {
    const { container } = render(<Note type="soon">Content</Note>)
    const soonNote = container.querySelector("[data-testid='soon-note']")
    expect(soonNote).toBeInTheDocument()
  })

  test("passes children to note component", () => {
    const { container } = render(<Note>Test Content</Note>)
    expect(container).toHaveTextContent("Test Content")
  })

  test("passes title to note component", () => {
    const { container } = render(<Note title="Custom Title">Content</Note>)
    const note = container.querySelector("[data-testid='default-note']")
    expect(note).toHaveAttribute("data-title", "Custom Title")
  })

  test("passes forceMultiline to note component", () => {
    const { container } = render(<Note forceMultiline={true}>Content</Note>)
    const note = container.querySelector("[data-testid='default-note']")
    expect(note).toBeInTheDocument()
  })
})
