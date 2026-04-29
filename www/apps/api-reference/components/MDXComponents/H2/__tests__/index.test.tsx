import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { cleanup, render } from "@testing-library/react"

// mock functions
const mockScrollToElement = vi.fn()
const mockUseScrollController = vi.fn(() => ({
  scrollableElement: null as HTMLElement | null,
  scrollToElement: mockScrollToElement,
}))
const mockUseSidebar = vi.fn(() => ({
  activePath: null as string | null,
}))

// mock components
vi.mock("docs-ui", () => ({
  useScrollController: () => mockUseScrollController(),
  useSidebar: () => mockUseSidebar(),
  H2: ({
    passRef,
    ...props
  }: {
    passRef: React.RefObject<HTMLHeadingElement>
  } & React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 {...props} ref={passRef} />
  ),
}))
vi.mock("docs-utils", () => ({
  getSectionId: vi.fn(() => "section-id"),
}))

import H2 from ".."

beforeEach(() => {
  vi.clearAllMocks()
  cleanup()
})

describe("render", () => {
  test("renders children", () => {
    const { container } = render(<H2>Test</H2>)
    const h2 = container.querySelector("h2")
    expect(h2).toBeInTheDocument()
    expect(h2).toHaveTextContent("Test")
  })

  test("renders with custom props", () => {
    const { container } = render(<H2 className="test-class">Test</H2>)
    const h2 = container.querySelector("h2")
    expect(h2).toBeInTheDocument()
    expect(h2).toHaveClass("test-class")
  })
})

describe("section id", () => {
  test("uses generated id", () => {
    const { container } = render(<H2>Test</H2>)
    const h2 = container.querySelector("h2")
    expect(h2).toBeInTheDocument()
    expect(h2).toHaveAttribute("id", "section-id")
  })
})

describe("scroll", () => {
  test("scrolls to element when active path matches id", () => {
    mockUseScrollController.mockReturnValueOnce({
      scrollableElement: document.body,
      scrollToElement: mockScrollToElement,
    })
    mockUseSidebar.mockReturnValueOnce({
      activePath: "section-id",
    })
    render(<H2>Test</H2>)
    const heading = document.querySelector("h2")
    expect(heading).toBeInTheDocument()
    expect(mockScrollToElement).toHaveBeenCalledWith(heading)
  })

  test("does not scroll to element when active path does not match id", () => {
    mockUseScrollController.mockReturnValueOnce({
      scrollableElement: document.body,
      scrollToElement: mockScrollToElement,
    })
    mockUseSidebar.mockReturnValueOnce({
      activePath: "other-section-id",
    })
    render(<H2>Test</H2>)
    const heading = document.querySelector("h2")
    expect(heading).toBeInTheDocument()
    expect(mockScrollToElement).not.toHaveBeenCalled()
  })
})