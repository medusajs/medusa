import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
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
      data-testid="split-list-link"
      {...props}
    >
      {children}
    </a>
  ),
}))

import { SplitList } from "../../SplitLists"

beforeEach(() => {
  vi.clearAllMocks()
})

describe("rendering", () => {
  test("renders items in lists", () => {
    const items = [
      { title: "Item 1", link: "/item1" },
      { title: "Item 2", link: "/item2" },
    ]
    const { container } = render(<SplitList items={items} />)
    const links = container.querySelectorAll("[data-testid='split-list-link']")
    expect(links).toHaveLength(2)
    expect(links[0]).toHaveTextContent("Item 1")
    expect(links[1]).toHaveTextContent("Item 2")
  })

  test("renders items with descriptions", () => {
    const items = [
      { title: "Item 1", link: "/item1", description: "Description 1" },
      { title: "Item 2", link: "/item2", description: "Description 2" },
    ]
    const { container } = render(<SplitList items={items} />)
    const descriptions = container.querySelectorAll(
      "[data-testid='split-list-description']"
    )
    expect(descriptions).toHaveLength(2)
    expect(descriptions[0]).toHaveTextContent("Description 1")
    expect(descriptions[1]).toHaveTextContent("Description 2")
  })

  test("does not render description when not provided", () => {
    const items = [
      { title: "Item 1", link: "/item1" },
      { title: "Item 2", link: "/item2" },
    ]
    const { container } = render(<SplitList items={items} />)
    const descriptions = container.querySelectorAll(
      "[data-testid='split-list-description']"
    )
    expect(descriptions).toHaveLength(0)
  })

  test("renders correct number of lists with default listsNum", () => {
    const items = [
      { title: "Item 1", link: "/item1" },
      { title: "Item 2", link: "/item2" },
      { title: "Item 3", link: "/item3" },
      { title: "Item 4", link: "/item4" },
    ]
    const { container } = render(<SplitList items={items} />)
    const lists = container.querySelectorAll("ul")
    expect(lists).toHaveLength(2)
  })

  test("renders correct number of lists with custom listsNum", () => {
    const items = [
      { title: "Item 1", link: "/item1" },
      { title: "Item 2", link: "/item2" },
      { title: "Item 3", link: "/item3" },
    ]
    const { container } = render(<SplitList items={items} listsNum={3} />)
    const lists = container.querySelectorAll("ul")
    expect(lists).toHaveLength(3)
  })

  test("distributes items evenly across lists using round-robin", () => {
    const items = [
      { title: "Item 1", link: "/item1" },
      { title: "Item 2", link: "/item2" },
      { title: "Item 3", link: "/item3" },
      { title: "Item 4", link: "/item4" },
      { title: "Item 5", link: "/item5" },
    ]
    const { container } = render(<SplitList items={items} listsNum={2} />)
    const lists = container.querySelectorAll("ul")
    // First list should have items 1, 3, 5 (indices 0, 2, 4)
    expect(lists[0]).toHaveTextContent("Item 1")
    expect(lists[0]).toHaveTextContent("Item 3")
    expect(lists[0]).toHaveTextContent("Item 5")
    // Second list should have items 2, 4 (indices 1, 3)
    expect(lists[1]).toHaveTextContent("Item 2")
    expect(lists[1]).toHaveTextContent("Item 4")
  })

  test("distributes items across three lists using round-robin", () => {
    const items = [
      { title: "Item 1", link: "/item1" },
      { title: "Item 2", link: "/item2" },
      { title: "Item 3", link: "/item3" },
      { title: "Item 4", link: "/item4" },
    ]
    const { container } = render(<SplitList items={items} listsNum={3} />)
    const lists = container.querySelectorAll("ul")
    // First list should have items 1, 4 (indices 0, 3)
    expect(lists[0]).toHaveTextContent("Item 1")
    expect(lists[0]).toHaveTextContent("Item 4")
    // Second list should have item 2 (index 1)
    expect(lists[1]).toHaveTextContent("Item 2")
    // Third list should have item 3 (index 2)
    expect(lists[2]).toHaveTextContent("Item 3")
  })

  test("renders empty lists when items array is empty", () => {
    const { container } = render(<SplitList items={[]} />)
    const lists = container.querySelectorAll("ul")
    expect(lists).toHaveLength(2)
    expect(lists[0].children).toHaveLength(0)
    expect(lists[1].children).toHaveLength(0)
  })

  test("renders single item in first list", () => {
    const items = [{ title: "Item 1", link: "/item1" }]
    const { container } = render(<SplitList items={items} />)
    const lists = container.querySelectorAll("ul")
    expect(lists[0]).toHaveTextContent("Item 1")
    expect(lists[1].children).toHaveLength(0)
  })

  test("applies gap between lists", () => {
    const items = [
      { title: "Item 1", link: "/item1" },
      { title: "Item 2", link: "/item2" },
    ]
    const { container } = render(<SplitList items={items} />)
    const containerDiv = container.querySelector("div")
    expect(containerDiv).toHaveClass("gap-docs_0.5")
  })
})

describe("edge cases", () => {
  test("handles single list correctly", () => {
    const items = [
      { title: "Item 1", link: "/item1" },
      { title: "Item 2", link: "/item2" },
    ]
    const { container } = render(<SplitList items={items} listsNum={1} />)
    const lists = container.querySelectorAll("ul")
    expect(lists).toHaveLength(1)
    expect(lists[0]).toHaveTextContent("Item 1")
    expect(lists[0]).toHaveTextContent("Item 2")
  })

  test("handles more lists than items", () => {
    const items = [{ title: "Item 1", link: "/item1" }]
    const { container } = render(<SplitList items={items} listsNum={5} />)
    const lists = container.querySelectorAll("ul")
    expect(lists).toHaveLength(5)
    // Only first list should have the item
    expect(lists[0]).toHaveTextContent("Item 1")
    // Other lists should be empty
    for (let i = 1; i < 5; i++) {
      expect(lists[i].children).toHaveLength(0)
    }
  })

  test("handles items with same link", () => {
    const items = [
      { title: "Item 1", link: "/same" },
      { title: "Item 2", link: "/same" },
    ]
    const { container } = render(<SplitList items={items} />)
    const links = container.querySelectorAll("[data-testid='split-list-link']")
    expect(links).toHaveLength(2)
    expect(links[0]).toHaveAttribute("href", "/same")
    expect(links[1]).toHaveAttribute("href", "/same")
  })

  test("handles items with empty strings", () => {
    const items = [
      { title: "", link: "/item1" },
      { title: "Item 2", link: "" },
    ]
    const { container } = render(<SplitList items={items} />)
    const links = container.querySelectorAll("[data-testid='split-list-link']")
    expect(links).toHaveLength(2)
    expect(links[0]).toHaveTextContent("")
    expect(links[1]).toHaveTextContent("Item 2")
  })
})
