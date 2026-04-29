import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { render } from "@testing-library/react"
import { H3 } from "../../H3"
import { LinkProps } from "../../../Link"

// mock functions
const mockUseHeadingUrl = vi.fn(() => "https://example.com")
const mockUseLayout = vi.fn(() => ({ showCollapsedNavbar: false }))

// mock components
vi.mock("@/components/CopyButton", () => ({
  CopyButton: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="copy-button">{children}</div>
  ),
}))

vi.mock("@/components/Link", () => ({
  Link: (props: LinkProps) => <a {...props} />,
}))

vi.mock("@/providers/Layout", () => ({
  useLayout: () => mockUseLayout(),
}))

vi.mock("@/hooks/use-heading-url", () => ({
  useHeadingUrl: () => mockUseHeadingUrl(),
}))

beforeEach(() => {
  vi.clearAllMocks()
})

describe("rendering", () => {
  test("renders correctly", () => {
    const { container } = render(<H3>Test</H3>)
    const h3 = container.querySelector("h3")
    expect(h3).toBeInTheDocument()
    expect(h3).toHaveTextContent("Test")
  })

  test("renders with id", () => {
    const { container } = render(<H3 id="test-id">Test</H3>)
    const h3 = container.querySelector("h3")
    expect(h3).toBeInTheDocument()
    const copyButton = container.querySelector("[data-testid='copy-button']")
    expect(copyButton).toBeInTheDocument()
    const link = copyButton?.querySelector("a")
    expect(link).toBeInTheDocument()
    expect(link).toHaveTextContent("#")
    expect(link).toHaveAttribute("href", "#test-id")
  })

  test("renders with collapsed navbar and id", () => {
    mockUseLayout.mockReturnValue({ showCollapsedNavbar: true })
    const { container } = render(<H3 id="test-id">Test</H3>)
    const h3 = container.querySelector("h3")
    expect(h3).toBeInTheDocument()
    expect(h3).toHaveClass("scroll-m-docs_7")
  })

  test("renders with non-collapsed navbar and id", () => {
    mockUseLayout.mockReturnValue({ showCollapsedNavbar: false })
    const { container } = render(<H3 id="test-id">Test</H3>)
    const h3 = container.querySelector("h3")
    expect(h3).toBeInTheDocument()
    expect(h3).toHaveClass("scroll-m-56")
  })
})
