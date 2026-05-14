import React from "react"
import { describe, expect, test, vi } from "vitest"
import { render } from "@testing-library/react"

// mock components
vi.mock("@/components/Link", () => ({
  Link: ({
    children,
    href,
    className,
    ...props
  }: {
    children: React.ReactNode
    href: string
    className?: string
    [key: string]: unknown
  }) => (
    <a
      href={href}
      className={className}
      data-testid="source-code-link"
      {...props}
    >
      {children}
    </a>
  ),
}))

vi.mock("@/components/Badge", () => ({
  Badge: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="source-code-badge">{children}</div>
  ),
}))

vi.mock("@/components/Icons/Github", () => ({
  GithubIcon: () => <svg data-testid="github-icon" />,
}))

import { SourceCodeLink } from "../index"

describe("rendering", () => {
  test("renders source code link", () => {
    const { container } = render(
      <SourceCodeLink link="https://github.com/medusajs/medusa" />
    )
    const link = container.querySelector("[data-testid='source-code-link']")
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute("href", "https://github.com/medusajs/medusa")
    const badge = container.querySelector("[data-testid='source-code-badge']")
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveTextContent("Source Code")
  })

  test("renders source code link with text", () => {
    const { container } = render(
      <SourceCodeLink
        link="https://github.com/medusajs/medusa"
        text="Custom Text"
      />
    )
    const badge = container.querySelector("[data-testid='source-code-badge']")
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveTextContent("Custom Text")
  })

  test("renders source code link with icon", () => {
    const { container } = render(
      <SourceCodeLink
        link="https://github.com/medusajs/medusa"
        icon={<span data-testid="custom-icon">Custom Icon</span>}
      />
    )
    const icon = container.querySelector("[data-testid='custom-icon']")
    expect(icon).toBeInTheDocument()
  })

  test("renders source code link with custom className", () => {
    const { container } = render(
      <SourceCodeLink
        link="https://github.com/medusajs/medusa"
        className="custom-class"
      />
    )
    const link = container.querySelector("[data-testid='source-code-link']")
    expect(link).toHaveClass("custom-class")
  })
})
