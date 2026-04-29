import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { render } from "@testing-library/react"

// mock components
vi.mock("next/link", () => ({
  default: ({
    href,
    className,
    children,
    target,
    rel,
  }: {
    href: string
    className?: string
    children: React.ReactNode
    target?: string
    rel?: string
  }) => (
    <a
      href={href}
      className={className}
      target={target}
      rel={rel}
      data-testid="prerequisite-link"
    >
      {children}
    </a>
  ),
}))

import { PrerequisiteItem } from "../../Item"

beforeEach(() => {
  vi.clearAllMocks()
})

describe("rendering", () => {
  test("renders prerequisite item", () => {
    const { container } = render(
      <PrerequisiteItem item={{ text: "Test Item" }} />
    )
    const link = container.querySelector("[data-testid='prerequisite-link']")
    expect(link).toBeInTheDocument()
    expect(link).toHaveTextContent("Test Item")
  })

  test("renders external link indicator when link is provided", () => {
    const { container } = render(
      <PrerequisiteItem item={{ text: "Test", link: "/test" }} />
    )
    expect(container).toHaveTextContent("↗")
  })

  test("does not render external link indicator when link is not provided", () => {
    const { container } = render(<PrerequisiteItem item={{ text: "Test" }} />)
    expect(container).not.toHaveTextContent("↗")
  })

  test("uses provided link", () => {
    const { container } = render(
      <PrerequisiteItem item={{ text: "Test", link: "/custom-link" }} />
    )
    const link = container.querySelector("[data-testid='prerequisite-link']")
    expect(link).toHaveAttribute("href", "/custom-link")
  })

  test("uses default href when link is not provided", () => {
    const { container } = render(<PrerequisiteItem item={{ text: "Test" }} />)
    const link = container.querySelector("[data-testid='prerequisite-link']")
    expect(link).toHaveAttribute("href", "#")
  })

  test("opens in new tab when link is provided", () => {
    const { container } = render(
      <PrerequisiteItem item={{ text: "Test", link: "/test" }} />
    )
    const link = container.querySelector("[data-testid='prerequisite-link']")
    expect(link).toHaveAttribute("target", "_blank")
    expect(link).toHaveAttribute("rel", "noopener noreferrer")
  })

  test("does not open in new tab when link is not provided", () => {
    const { container } = render(<PrerequisiteItem item={{ text: "Test" }} />)
    const link = container.querySelector("[data-testid='prerequisite-link']")
    expect(link).not.toHaveAttribute("target", "_blank")
    expect(link).not.toHaveAttribute("rel", "noopener noreferrer")
  })

  test("applies cursor-text when link is not provided", () => {
    const { container } = render(<PrerequisiteItem item={{ text: "Test" }} />)
    const link = container.querySelector("[data-testid='prerequisite-link']")
    expect(link).toHaveClass("cursor-text")
  })

  test("does not apply cursor-text when link is provided", () => {
    const { container } = render(
      <PrerequisiteItem item={{ text: "Test", link: "/test" }} />
    )
    const link = container.querySelector("[data-testid='prerequisite-link']")
    expect(link).not.toHaveClass("cursor-text")
  })

  test("applies hover styles when link is provided", () => {
    const { container } = render(
      <PrerequisiteItem item={{ text: "Test", link: "/test" }} />
    )
    const link = container.querySelector("[data-testid='prerequisite-link']")
    expect(link).toHaveClass("hover:bg-medusa-tag-neutral-bg-hover")
  })
})

describe("position styling", () => {
  test("applies alone position styles", () => {
    const { container } = render(
      <PrerequisiteItem item={{ text: "Test", position: "alone" }} />
    )
    const link = container.querySelector("[data-testid='prerequisite-link']")
    expect(link).toHaveClass("rounded-docs_xl")
  })

  test("applies top position styles", () => {
    const { container } = render(
      <PrerequisiteItem item={{ text: "Test", position: "top" }} />
    )
    const link = container.querySelector("[data-testid='prerequisite-link']")
    expect(link).toHaveClass("rounded-tl-docs_xl")
    expect(link).toHaveClass("rounded-bl-docs_DEFAULT")
  })

  test("applies middle position styles", () => {
    const { container } = render(
      <PrerequisiteItem item={{ text: "Test", position: "middle" }} />
    )
    const link = container.querySelector("[data-testid='prerequisite-link']")
    expect(link).toHaveClass("rounded-tl-docs_DEFAULT")
    expect(link).toHaveClass("rounded-bl-docs_DEFAULT")
  })

  test("applies bottom position styles", () => {
    const { container } = render(
      <PrerequisiteItem item={{ text: "Test", position: "bottom" }} />
    )
    const link = container.querySelector("[data-testid='prerequisite-link']")
    expect(link).toHaveClass("rounded-tl-docs_DEFAULT")
    expect(link).toHaveClass("rounded-bl-docs_xl")
  })

  test("defaults to alone position when not specified", () => {
    const { container } = render(<PrerequisiteItem item={{ text: "Test" }} />)
    const link = container.querySelector("[data-testid='prerequisite-link']")
    expect(link).toHaveClass("rounded-docs_xl")
  })
})
