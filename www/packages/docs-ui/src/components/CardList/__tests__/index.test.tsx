import React from "react"
import { describe, expect, test, vi } from "vitest"
import { render } from "@testing-library/react"
import { CardProps } from "../../Card"

// mock components
vi.mock("@/components/Card", () => ({
  Card: () => <div data-testid="card">Card</div>,
}))

import { CardList } from "../../CardList"

describe("rendering", () => {
  test("render card list with one item", () => {
    const items: CardProps[] = [{ title: "Item 1" }]
    const { container } = render(<CardList items={items} />)
    expect(container).toBeInTheDocument()
    const section = container.querySelector("section")
    expect(section).toBeInTheDocument()
    expect(section).toHaveClass("grid-cols-1")
    const cards = container.querySelectorAll("[data-testid='card']")
    expect(cards).toHaveLength(items.length)
  })
  test("render card list even number of items", () => {
    const items: CardProps[] = [{ title: "Item 1" }, { title: "Item 2" }]
    const { container } = render(<CardList items={items} />)
    expect(container).toBeInTheDocument()
    const section = container.querySelector("section")
    expect(section).toBeInTheDocument()
    expect(section).toHaveClass("md:grid-cols-2 grid-cols-1")
    const cards = container.querySelectorAll("[data-testid='card']")
    expect(cards).toHaveLength(items.length)
  })
  test("render card list odd number of items", () => {
    const items: CardProps[] = [
      { title: "Item 1" },
      { title: "Item 2" },
      { title: "Item 3" },
    ]
    const { container } = render(<CardList items={items} />)
    expect(container).toBeInTheDocument()
    const section = container.querySelector("section")
    expect(section).toBeInTheDocument()
    expect(section).toHaveClass("lg:grid-cols-3 md:grid-col-2 grid-cols-1")
    const cards = container.querySelectorAll("[data-testid='card']")
    expect(cards).toHaveLength(items.length)
  })
  test("render card list with default items per row", () => {
    const items: CardProps[] = [
      { title: "Item 1" },
      { title: "Item 2" },
      { title: "Item 3" },
    ]
    const { container } = render(
      <CardList items={items} defaultItemsPerRow={2} />
    )
    expect(container).toBeInTheDocument()
    const section = container.querySelector("section")
    expect(section).toBeInTheDocument()
    expect(section).toHaveClass("md:grid-cols-2 grid-cols-1")
    const cards = container.querySelectorAll("[data-testid='card']")
    expect(cards).toHaveLength(items.length)
  })
  test("render card list with items per row", () => {
    const items: CardProps[] = [
      { title: "Item 1" },
      { title: "Item 2" },
      { title: "Item 3" },
    ]
    const { container } = render(<CardList items={items} itemsPerRow={2} />)
    expect(container).toBeInTheDocument()
    const section = container.querySelector("section")
    expect(section).toBeInTheDocument()
    expect(section).toHaveClass("md:grid-cols-2 grid-cols-1")
    const cards = container.querySelectorAll("[data-testid='card']")
    expect(cards).toHaveLength(items.length)
  })
  test("render card list with one item and default items per row", () => {
    const items: CardProps[] = [{ title: "Item 1" }]
    const { container } = render(
      <CardList items={items} defaultItemsPerRow={2} />
    )
    expect(container).toBeInTheDocument()
    const section = container.querySelector("section")
    expect(section).toBeInTheDocument()
    expect(section).toHaveClass("grid-cols-1")
    const cards = container.querySelectorAll("[data-testid='card']")
    expect(cards).toHaveLength(items.length)
  })
  test("render card list with items per row, ignoring default items per row", () => {
    const items: CardProps[] = [
      { title: "Item 1" },
      { title: "Item 2" },
      { title: "Item 3" },
    ]
    const { container } = render(
      <CardList items={items} itemsPerRow={2} defaultItemsPerRow={3} />
    )
    expect(container).toBeInTheDocument()
    const section = container.querySelector("section")
    expect(section).toBeInTheDocument()
    expect(section).toHaveClass("md:grid-cols-2 grid-cols-1")
    const cards = container.querySelectorAll("[data-testid='card']")
    expect(cards).toHaveLength(items.length)
  })
  test("render card list with className", () => {
    const className = "test-class"
    const items: CardProps[] = [{ title: "Item 1" }]
    const { container } = render(
      <CardList items={items} className={className} />
    )
    expect(container).toBeInTheDocument()
    const section = container.querySelector("section")
    expect(section).toBeInTheDocument()
    expect(section).toHaveClass(className)
  })
})
