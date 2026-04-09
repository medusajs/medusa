import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { render } from "@testing-library/react"

// mock components
vi.mock("@/components/MarkdownContent", () => ({
  MarkdownContent: ({
    children,
    allowedElements,
  }: {
    children: React.ReactNode
    allowedElements?: string[]
  }) => (
    <div
      data-testid="markdown-content"
      data-allowed-elements={allowedElements?.join(",")}
    >
      {children}
    </div>
  ),
}))

import { NoteLayout } from "../../Layout"
import { InlineCode } from "../../../InlineCode"

beforeEach(() => {
  vi.clearAllMocks()
})

describe("rendering", () => {
  test("renders note layout", () => {
    const { container } = render(<NoteLayout>Content</NoteLayout>)
    const layout = container.querySelector("[data-testid='note-layout']")
    expect(layout).toBeInTheDocument()
    expect(layout).toHaveTextContent("Content")
  })

  test("adds colon after title when title does not end with punctuation", () => {
    const { container } = render(
      <NoteLayout title="Test Title">Content</NoteLayout>
    )
    const title = container.querySelector("[data-testid='note-layout-title']")
    expect(title).toBeInTheDocument()
    expect(title).toHaveTextContent("Test Title:")
  })

  test("does not add colon when title ends with period", () => {
    const { container } = render(
      <NoteLayout title="Test Title.">Content</NoteLayout>
    )
    const title = container.querySelector("[data-testid='note-layout-title']")
    expect(title).toBeInTheDocument()
    expect(title).toHaveTextContent("Test Title.")
  })

  test("does not add colon when title ends with colon", () => {
    const { container } = render(
      <NoteLayout title="Test Title:">Content</NoteLayout>
    )
    const title = container.querySelector("[data-testid='note-layout-title']")
    expect(title).toBeInTheDocument()
    expect(title).toHaveTextContent("Test Title:")
    // Should not have double colon
    expect(title).not.toHaveTextContent("Test Title::")
  })

  test("does not add colon when title ends with semicolon", () => {
    const { container } = render(
      <NoteLayout title="Test Title;">Content</NoteLayout>
    )
    const title = container.querySelector("[data-testid='note-layout-title']")
    expect(title).toBeInTheDocument()
    expect(title).toHaveTextContent("Test Title;")
    expect(title).not.toHaveTextContent("Test Title;:")
  })

  test("does not add colon when title ends with comma", () => {
    const { container } = render(
      <NoteLayout title="Test Title,">Content</NoteLayout>
    )
    const title = container.querySelector("[data-testid='note-layout-title']")
    expect(title).toBeInTheDocument()
    expect(title).toHaveTextContent("Test Title,")
    expect(title).not.toHaveTextContent("Test Title,:")
  })

  test("does not add colon when title ends with exclamation", () => {
    const { container } = render(
      <NoteLayout title="Test Title!">Content</NoteLayout>
    )
    const title = container.querySelector("[data-testid='note-layout-title']")
    expect(title).toBeInTheDocument()
    expect(title).toHaveTextContent("Test Title!")
    expect(title).not.toHaveTextContent("Test Title!:")
  })

  test("does not add colon when title ends with question mark", () => {
    const { container } = render(
      <NoteLayout title="Test Title?">Content</NoteLayout>
    )
    const title = container.querySelector("[data-testid='note-layout-title']")
    expect(title).toBeInTheDocument()
    expect(title).toHaveTextContent("Test Title?")
    expect(title).not.toHaveTextContent("Test Title?:")
  })

  test("renders colored indicator for default type", () => {
    const { container } = render(
      <NoteLayout type="default">Content</NoteLayout>
    )
    const indicator = container.querySelector(
      "[data-testid='note-layout-indicator']"
    )
    expect(indicator).toHaveClass("bg-medusa-tag-neutral-icon")
  })

  test("renders colored indicator for check type", () => {
    const { container } = render(<NoteLayout type="check">Content</NoteLayout>)
    const indicator = container.querySelector(
      "[data-testid='note-layout-indicator']"
    )
    expect(indicator).toHaveClass("bg-medusa-tag-neutral-icon")
  })

  test("renders colored indicator for error type", () => {
    const { container } = render(<NoteLayout type="error">Content</NoteLayout>)
    const indicator = container.querySelector(
      "[data-testid='note-layout-indicator']"
    )
    expect(indicator).toHaveClass("bg-medusa-tag-red-icon")
  })

  test("renders colored indicator for warning type", () => {
    const { container } = render(
      <NoteLayout type="warning">Content</NoteLayout>
    )
    const indicator = container.querySelector(
      "[data-testid='note-layout-indicator']"
    )
    expect(indicator).toHaveClass("bg-medusa-tag-red-icon")
  })

  test("renders colored indicator for success type", () => {
    const { container } = render(
      <NoteLayout type="success">Content</NoteLayout>
    )
    const indicator = container.querySelector(
      "[data-testid='note-layout-indicator']"
    )
    expect(indicator).toHaveClass("bg-medusa-tag-green-icon")
  })

  test("renders colored indicator for soon type", () => {
    const { container } = render(<NoteLayout type="soon">Content</NoteLayout>)
    const indicator = container.querySelector(
      "[data-testid='note-layout-indicator']"
    )
    expect(indicator).toHaveClass("bg-medusa-tag-blue-icon")
  })
})

describe("string children handling", () => {
  test("renders MarkdownContent for string children", () => {
    const { container } = render(<NoteLayout>Simple text content</NoteLayout>)
    const markdown = container.querySelector("[data-testid='markdown-content']")
    expect(markdown).toBeInTheDocument()
    expect(markdown).toHaveTextContent("Simple text content")
  })

  test("renders MarkdownContent for number children", () => {
    const { container } = render(<NoteLayout>{123}</NoteLayout>)
    const markdown = container.querySelector("[data-testid='markdown-content']")
    expect(markdown).toBeInTheDocument()
    expect(markdown).toHaveTextContent("123")
  })

  test("renders MarkdownContent with allowed elements", () => {
    const { container } = render(
      <NoteLayout>
        Text with <a href="/link">link</a>
      </NoteLayout>
    )
    const markdown = container.querySelector("[data-testid='markdown-content']")
    expect(markdown).toHaveAttribute("data-allowed-elements", "a,code")
  })

  test("renders children directly when forceMultiline is true", () => {
    const { container } = render(
      <NoteLayout forceMultiline={true}>Simple text</NoteLayout>
    )
    const markdown = container.querySelector("[data-testid='markdown-content']")
    expect(markdown).not.toBeInTheDocument()
    expect(container).toHaveTextContent("Simple text")
  })

  test("renders children directly when children contain list items", () => {
    const { container } = render(
      <NoteLayout>
        <ul>
          <li>Item 1</li>
        </ul>
      </NoteLayout>
    )
    const markdown = container.querySelector("[data-testid='markdown-content']")
    expect(markdown).not.toBeInTheDocument()
    expect(container).toHaveTextContent("Item 1")
  })

  test("renders MarkdownContent for link elements with string children", () => {
    const { container } = render(
      <NoteLayout>
        <a href="/test">Link text</a>
      </NoteLayout>
    )
    const markdown = container.querySelector("[data-testid='markdown-content']")
    expect(markdown).toBeInTheDocument()
    expect(markdown).toHaveTextContent("[Link text](/test)")
  })

  test("renders MarkdownContent for inline code elements", () => {
    const { container } = render(
      <NoteLayout>
        <InlineCode>code content</InlineCode>
      </NoteLayout>
    )
    const markdown = container.querySelector("[data-testid='markdown-content']")
    expect(markdown).toBeInTheDocument()
    expect(markdown).toHaveTextContent("`code content`")
  })
})
