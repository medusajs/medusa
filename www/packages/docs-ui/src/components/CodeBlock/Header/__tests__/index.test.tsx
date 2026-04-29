import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { render } from "@testing-library/react"
import { BadgeProps } from "../../../Badge"

// mock data
const mockColorMode = "light"
const mockActionsProps: CodeBlockActionsProps = {
  source: "console.log('Hello, world!')",
  inHeader: true,
  isCollapsed: false,
}

// mock functions
const mockUseColorMode = vi.fn(() => ({
  colorMode: mockColorMode,
}))

// mock components
vi.mock("@/providers/ColorMode", () => ({
  useColorMode: () => mockUseColorMode(),
}))
vi.mock("@/components/Badge", () => ({
  Badge: ({ children, variant }: BadgeProps) => (
    <div>
      <span data-testid="badge-variant">{variant}</span>
      <span data-testid="badge-children">{children}</span>
    </div>
  ),
}))
vi.mock("@/components/CodeBlock/Actions", () => ({
  CodeBlockActions: () => <div data-testid="code-block-actions">Actions</div>,
}))
vi.mock("@/components/CodeBlock/Header/Wrapper", () => ({
  CodeBlockHeaderWrapper: ({
    children,
    blockStyle,
  }: CodeBlockHeaderWrapperProps) => (
    <div data-testid="code-block-header-wrapper">
      <span data-testid="code-block-header-wrapper-blockStyle">
        {blockStyle}
      </span>
      <span data-testid="code-block-header-wrapper-children">{children}</span>
    </div>
  ),
}))

import { CodeBlockHeader } from "../index"
import { CodeBlockHeaderWrapperProps } from "../Wrapper"
import { CodeBlockActionsProps } from "../../Actions"

beforeEach(() => {
  mockUseColorMode.mockReturnValue({
    colorMode: mockColorMode,
  })
})

describe("render", () => {
  test("default render", () => {
    const { container } = render(
      <CodeBlockHeader actionsProps={mockActionsProps} />
    )
    expect(container).toBeInTheDocument()
    const header = container.querySelector("[data-testid='code-block-header']")
    expect(header).toBeInTheDocument()
    const actions = container.querySelector(
      "[data-testid='code-block-actions']"
    )
    expect(actions).toBeInTheDocument()
    expect(actions).toHaveTextContent("Actions")
  })

  test("render with title and loud block style", () => {
    const { container } = render(
      <CodeBlockHeader
        actionsProps={mockActionsProps}
        title="Title"
        blockStyle="loud"
      />
    )
    expect(container).toBeInTheDocument()
    const header = container.querySelector("[data-testid='code-block-header']")
    expect(header).toBeInTheDocument()
    const title = header?.querySelector(
      "[data-testid='code-block-header-title']"
    )
    expect(title).toBeInTheDocument()
    expect(title).toHaveTextContent("Title")
    expect(title).toHaveClass("text-medusa-contrast-fg-secondary")
    expect(title).not.toHaveClass("text-medusa-fg-subtle")
    const codeBlockHeaderWrapperBlockStyle = container.querySelector(
      "[data-testid='code-block-header-wrapper-blockStyle']"
    )
    expect(codeBlockHeaderWrapperBlockStyle).toBeInTheDocument()
    expect(codeBlockHeaderWrapperBlockStyle).toHaveTextContent("loud")
  })

  test("render with title and subtle block style", () => {
    const { container } = render(
      <CodeBlockHeader
        actionsProps={mockActionsProps}
        title="Title"
        blockStyle="subtle"
      />
    )
    expect(container).toBeInTheDocument()
    const header = container.querySelector("[data-testid='code-block-header']")
    expect(header).toBeInTheDocument()
    const title = header?.querySelector(
      "[data-testid='code-block-header-title']"
    )
    expect(title).toBeInTheDocument()
    expect(title).toHaveTextContent("Title")
    expect(title).toHaveClass("text-medusa-fg-subtle")
    expect(title).not.toHaveClass("text-medusa-contrast-fg-secondary")
    const codeBlockHeaderWrapperBlockStyle = container.querySelector(
      "[data-testid='code-block-header-wrapper-blockStyle']"
    )
    expect(codeBlockHeaderWrapperBlockStyle).toBeInTheDocument()
    expect(codeBlockHeaderWrapperBlockStyle).toHaveTextContent("subtle")
  })

  test("render with title and subtle block style and colorMode dark", () => {
    mockUseColorMode.mockReturnValue({
      colorMode: "dark",
    })
    const { container } = render(
      <CodeBlockHeader
        actionsProps={mockActionsProps}
        title="Title"
        blockStyle="subtle"
      />
    )
    expect(container).toBeInTheDocument()
    const header = container.querySelector("[data-testid='code-block-header']")
    expect(header).toBeInTheDocument()
    const title = header?.querySelector(
      "[data-testid='code-block-header-title']"
    )
    expect(title).toBeInTheDocument()
    expect(title).toHaveTextContent("Title")
    expect(title).toHaveClass("text-medusa-contrast-fg-secondary")
    expect(title).not.toHaveClass("text-medusa-fg-subtle")
    const codeBlockHeaderWrapperBlockStyle = container.querySelector(
      "[data-testid='code-block-header-wrapper-blockStyle']"
    )
    expect(codeBlockHeaderWrapperBlockStyle).toBeInTheDocument()
    expect(codeBlockHeaderWrapperBlockStyle).toHaveTextContent("subtle")
  })

  test("render with badge label", () => {
    const { container } = render(
      <CodeBlockHeader actionsProps={mockActionsProps} badgeLabel="Badge" />
    )
    expect(container).toBeInTheDocument()
    const header = container.querySelector("[data-testid='code-block-header']")
    expect(header).toBeInTheDocument()
    const badge = header?.querySelector("[data-testid='badge-children']")
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveTextContent("Badge")
    const badgeVariant = header?.querySelector("[data-testid='badge-variant']")
    expect(badgeVariant).toBeInTheDocument()
    expect(badgeVariant).toHaveTextContent("code")
  })

  test("render with badge label and color", () => {
    const { container } = render(
      <CodeBlockHeader
        actionsProps={mockActionsProps}
        badgeLabel="Badge"
        badgeColor="blue"
      />
    )
    expect(container).toBeInTheDocument()
    const header = container.querySelector("[data-testid='code-block-header']")
    expect(header).toBeInTheDocument()
    const badge = header?.querySelector("[data-testid='badge-children']")
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveTextContent("Badge")
    const badgeVariant = header?.querySelector("[data-testid='badge-variant']")
    expect(badgeVariant).toBeInTheDocument()
    expect(badgeVariant).toHaveTextContent("blue")
  })

  test("render with hideActions", () => {
    const { container } = render(
      <CodeBlockHeader actionsProps={mockActionsProps} hideActions={true} />
    )
    expect(container).toBeInTheDocument()
    const header = container.querySelector("[data-testid='code-block-header']")
    expect(header).toBeInTheDocument()
    const actions = container.querySelector(
      "[data-testid='code-block-actions']"
    )
    expect(actions).not.toBeInTheDocument()
  })
})
