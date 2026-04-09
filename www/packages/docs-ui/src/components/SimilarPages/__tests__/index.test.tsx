import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { render } from "@testing-library/react"

// mock data
const mockSimilarPages = [
  { id: "1", title: "Page 1", url: "/page1" },
  { id: "2", title: "Page 2", url: "/page2" },
]

// mock hooks
const mockUseSimilarPages = vi.fn(() => mockSimilarPages)

vi.mock("@/hooks/use-similar-pages", () => ({
  useSimilarPages: () => mockUseSimilarPages(),
}))

// mock components
vi.mock("@/components/Heading", () => ({
  H2: ({ children }: { children: React.ReactNode }) => (
    <h2 data-testid="similar-pages-title">{children}</h2>
  ),
}))

vi.mock("@/components/MDXComponents", () => ({
  MDXComponents: {
    p: ({ children }: { children: React.ReactNode }) => (
      <p data-testid="similar-pages-p">{children}</p>
    ),
    ul: ({ children }: { children: React.ReactNode }) => (
      <ul data-testid="similar-pages-ul">{children}</ul>
    ),
    li: ({ children }: { children: React.ReactNode }) => (
      <li data-testid="similar-pages-li">{children}</li>
    ),
    a: ({ children }: { children: React.ReactNode }) => (
      <a data-testid="similar-pages-a">{children}</a>
    ),
  },
}))

import { SimilarPages } from "../index"

beforeEach(() => {
  vi.clearAllMocks()
})

describe("SimilarPages", () => {
  test("renders similar pages", () => {
    const { container } = render(<SimilarPages />)
    expect(container).toHaveTextContent("Page 1")
    expect(container).toHaveTextContent("Page 2")
  })
  test("renders nothing when there are no similar pages", () => {
    mockUseSimilarPages.mockReturnValue([])
    const { container } = render(<SimilarPages />)
    expect(container).not.toHaveTextContent("Page 1")
    expect(container).not.toHaveTextContent("Page 2")
  })
})
