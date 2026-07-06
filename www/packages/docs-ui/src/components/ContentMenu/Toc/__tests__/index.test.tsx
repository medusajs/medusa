import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { fireEvent, render, waitFor } from "@testing-library/react"
import { ToCItem } from "types"

// mock data
const mockToc: ToCItem[] = [
  {
    title: "Overview",
    id: "overview",
    level: 2,
  },
  {
    title: "Getting Started",
    id: "getting-started",
    level: 2,
  },
]
const mockTocWithChildren: ToCItem[] = [
  {
    title: "Overview",
    id: "overview",
    level: 2,
  },
  {
    title: "Getting Started",
    id: "getting-started",
    level: 2,
    children: [
      {
        title: "Installation",
        id: "installation",
        level: 3,
      },
    ],
  },
]
let currentToc: ToCItem[] | null = mockToc as ToCItem[] | null
let currentFrontmatter = {
  generate_toc: false,
}
const mockHeading = document.createElement("h2")
mockHeading.id = "overview"
mockHeading.textContent = "Overview"
const mockUseActiveOnScroll = vi.fn(() => ({
  items: [
    {
      heading: mockHeading,
    },
  ],
  activeItemId: "overview",
}))

// mock functions
const mockSetToc = vi.fn((toc: ToCItem[] | null) => {
  currentToc = toc
})

// Create a getter function that always returns the latest values
const getUseSiteConfigReturn = () => ({
  toc: currentToc,
  frontmatter: currentFrontmatter,
  setToc: mockSetToc,
})

const mockUseSiteConfig = vi.fn(() => getUseSiteConfigReturn())
const mockScrollToElement = vi.fn()
const mockUseScrollController = vi.fn(() => ({
  scrollToElement: mockScrollToElement,
}))

// mock components
vi.mock("@/providers/SiteConfig", () => ({
  useSiteConfig: () => mockUseSiteConfig(),
}))
vi.mock("@/hooks/use-scroll-utils", () => ({
  useScrollController: () => mockUseScrollController(),
}))
vi.mock("@/hooks/use-active-on-scroll", () => ({
  useActiveOnScroll: () => mockUseActiveOnScroll(),
}))
vi.mock("@/components/Loading", () => ({
  Loading: () => <div data-testid="loading">Loading...</div>,
}))
vi.mock("@/components/ContentMenu/Section", () => ({
  ContentMenuSection: ({
    title,
    children,
  }: {
    title: string
    children: React.ReactNode
  }) => (
    <div data-testid="content-menu-section" data-title={title}>
      {children}
    </div>
  ),
}))

import { ContentMenuToc } from "../../Toc"

beforeEach(() => {
  // scrollIntoView is not available in the testing environment, so we need to mock it
  window.HTMLElement.prototype.scrollIntoView = function () {}

  // Reset toc and frontmatter to default values
  currentToc = mockToc as ToCItem[] | null
  currentFrontmatter = {
    generate_toc: false,
  }
  // Always use the getter function to return fresh values
  mockUseSiteConfig.mockImplementation(() => getUseSiteConfigReturn())
  mockSetToc.mockClear()
  mockUseScrollController.mockClear()
  mockUseActiveOnScroll.mockClear()
})

describe("render", () => {
  test("renders inside On this page section", () => {
    const { container } = render(<ContentMenuToc />)
    const section = container.querySelector(
      "[data-testid='content-menu-section']"
    )
    expect(section).toBeInTheDocument()
    expect(section).toHaveAttribute("data-title", "On this page")
  })

  test("render toc", () => {
    const { container } = render(<ContentMenuToc />)
    expect(container).toBeInTheDocument()
    const tocList = container.querySelector("[data-testid='toc-list']")
    expect(tocList).toBeInTheDocument()
    const tocItems = container.querySelectorAll("[data-testid='toc-item']")
    expect(tocItems).toHaveLength(2)
    expect(tocItems[0]).toBeInTheDocument()
    expect(tocItems[0]).toHaveTextContent("Overview")
    const tocItemLink0 = tocItems[0].querySelector("a")
    expect(tocItemLink0).toBeInTheDocument()
    expect(tocItemLink0).toHaveAttribute("href", "#overview")
    expect(tocItems[1]).toBeInTheDocument()
    expect(tocItems[1]).toHaveTextContent("Getting Started")
    const tocItemLink1 = tocItems[1].querySelector("a")
    expect(tocItemLink1).toBeInTheDocument()
    expect(tocItemLink1).toHaveAttribute("href", "#getting-started")
  })

  test("render toc with children", () => {
    mockUseSiteConfig.mockReturnValue({
      ...getUseSiteConfigReturn(),
      toc: mockTocWithChildren,
    })
    const { container } = render(<ContentMenuToc />)
    expect(container).toBeInTheDocument()
    const tocLists = container.querySelectorAll("[data-testid='toc-list']")
    expect(tocLists).toHaveLength(2)
    expect(tocLists[0]).toBeInTheDocument()
    const firstTocItems = tocLists[0].querySelectorAll(
      "[data-testid='toc-item']"
    )
    // the nested item will be included in the first toc list
    expect(firstTocItems).toHaveLength(3)
    expect(firstTocItems[0]).toBeInTheDocument()
    expect(firstTocItems[0]).toHaveTextContent("Overview")
    const firstTocItemLink0 = firstTocItems[0].querySelector("a")
    expect(firstTocItemLink0).toBeInTheDocument()
    expect(firstTocItemLink0).toHaveAttribute("href", "#overview")
    expect(firstTocItems[1]).toBeInTheDocument()
    expect(firstTocItems[1]).toHaveTextContent("Getting Started")
    const firstTocItemLink1 = firstTocItems[1].querySelector("a")
    expect(firstTocItemLink1).toBeInTheDocument()
    expect(firstTocItemLink1).toHaveAttribute("href", "#getting-started")
    const secondTocItems = tocLists[1].querySelectorAll(
      "[data-testid='toc-item']"
    )
    expect(secondTocItems).toHaveLength(1)
    expect(secondTocItems[0]).toBeInTheDocument()
    expect(secondTocItems[0]).toHaveTextContent("Installation")
    const secondTocItemLink0 = secondTocItems[0].querySelector("a")
    expect(secondTocItemLink0).toBeInTheDocument()
    expect(secondTocItemLink0).toHaveAttribute("href", "#installation")
  })

  test("render toc with no items", () => {
    currentToc = []
    const { container } = render(<ContentMenuToc />)
    expect(container).toBeInTheDocument()
    expect(container.childElementCount).toBe(0)
  })

  test("render toc with empty items", () => {
    currentToc = null
    const { container } = render(<ContentMenuToc />)
    expect(container).toBeInTheDocument()
    const emptyTocItems = container.querySelector(
      "[data-testid='empty-toc-items']"
    )
    expect(emptyTocItems).toBeInTheDocument()
  })
})

describe("toc generation", () => {
  test("generate toc", async () => {
    currentToc = null
    currentFrontmatter = {
      generate_toc: true,
    }
    const { container, rerender } = render(<ContentMenuToc />)
    expect(container).toBeInTheDocument()

    // Wait for useEffect to run and call setToc
    await waitFor(() => {
      expect(mockSetToc).toHaveBeenCalled()
    })

    // After setToc is called, currentToc should be updated
    // Rerender to see the updated toc
    rerender(<ContentMenuToc />)

    const tocList = container.querySelector("[data-testid='toc-list']")
    expect(tocList).toBeInTheDocument()
    const tocItems = container.querySelectorAll("[data-testid='toc-item']")
    expect(tocItems.length).toBeGreaterThan(0)
    if (tocItems.length > 0) {
      expect(tocItems[0]).toBeInTheDocument()
      expect(tocItems[0]).toHaveTextContent("Overview")
      const tocItemLink0 = tocItems[0].querySelector("a")
      expect(tocItemLink0).toBeInTheDocument()
      expect(tocItemLink0).toHaveAttribute("href", "#overview")
    }
  })
})

describe("toc scrolling", () => {
  test("scroll to toc item", () => {
    currentToc = mockToc as ToCItem[] | null
    const { container } = render(<ContentMenuToc />)
    expect(container).toBeInTheDocument()
    const tocItems = container.querySelectorAll("[data-testid='toc-item']")
    expect(tocItems).toHaveLength(2)
    const tocItemLink0 = tocItems[0].querySelector("a")
    expect(tocItemLink0).toBeInTheDocument()
    fireEvent.click(tocItemLink0!)
    expect(mockScrollToElement).toHaveBeenCalled()
  })
})
