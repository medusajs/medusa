import React from "react"
import { describe, expect, test, vi } from "vitest"
import { render } from "@testing-library/react"

vi.mock("next/link", () => ({
  default: ({
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
    <a href={href} className={className} {...props}>
      {children}
    </a>
  ),
}))

import { Link } from "../../Link"

describe("rendering", () => {
  test("renders link with href", () => {
    const { container } = render(<Link href="/test">Test Link</Link>)
    const link = container.querySelector("a")
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute("href", "/test")
    expect(link).toHaveTextContent("Test Link")
  })

  test("renders with default variant", () => {
    const { container } = render(<Link href="/test">Test Link</Link>)
    const link = container.querySelector("a")
    expect(link).toHaveClass(
      "text-medusa-fg-interactive hover:text-medusa-fg-interactive-hover"
    )
  })

  test("renders with content variant", () => {
    const { container } = render(
      <Link href="/test" variant="content">
        Test Link
      </Link>
    )
    const link = container.querySelector("a")
    expect(link).toHaveClass(
      "underline decoration-medusa-fg-muted hover:decoration-medusa-fg-interactive"
    )
    expect(link).toHaveClass(
      "decoration-[1.5px] font-medium transition-[text-decoration-color]"
    )
  })

  test("applies custom className", () => {
    const { container } = render(
      <Link href="/test" className="custom-class">
        Test Link
      </Link>
    )
    const link = container.querySelector("a")
    expect(link).toHaveClass("custom-class")
  })

  test("renders with icon when withIcon is true", () => {
    const { container } = render(
      <Link href="/test" withIcon>
        Test Link
      </Link>
    )
    const link = container.querySelector("a")
    expect(link).toHaveClass("flex gap-0.25 items-center group")
    const icon = container.querySelector("svg")
    expect(icon).toBeInTheDocument()
  })

  test("does not render icon when withIcon is false", () => {
    const { container } = render(<Link href="/test">Test Link</Link>)
    const icon = container.querySelector("svg")
    expect(icon).not.toBeInTheDocument()
  })

  test("transforms page.mdx href", () => {
    const { container } = render(<Link href="/test/page.mdx">Test Link</Link>)
    const link = container.querySelector("a")
    expect(link).toHaveAttribute("href", "/test")
  })

  test("transforms page.mdx href with hash", () => {
    const { container } = render(
      <Link href="/test/page.mdx#section">Test Link</Link>
    )
    const link = container.querySelector("a")
    expect(link).toHaveAttribute("href", "/test#section")
  })

  test("handles empty href", () => {
    const { container } = render(<Link href="">Test Link</Link>)
    const link = container.querySelector("a")
    expect(link).toHaveAttribute("href", "")
  })

  test("handles undefined href", () => {
    const { container } = render(<Link>Test Link</Link>)
    const link = container.querySelector("a")
    expect(link).toHaveAttribute("href", "")
  })

  test("passes through other props", () => {
    const { container } = render(
      <Link href="/test" target="_blank" rel="noopener">
        Test Link
      </Link>
    )
    const link = container.querySelector("a")
    expect(link).toHaveAttribute("target", "_blank")
    expect(link).toHaveAttribute("rel", "noopener")
  })
})
