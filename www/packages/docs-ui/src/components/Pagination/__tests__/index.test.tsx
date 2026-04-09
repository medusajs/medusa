import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { render } from "@testing-library/react"

// mock data
const previousPage = {
  title: "Previous",
  parentTitle: "Parent",
  link: "/previous",
} as Page | null
const nextPage = {
  title: "Next",
  parentTitle: "Parent",
  link: "/next",
} as Page | null

// mock functions
const mockUsePagination = vi.fn(() => ({
  previousPage,
  nextPage,
}))

// mock components
vi.mock("@/providers/Pagination", () => ({
  usePagination: () => mockUsePagination(),
}))

vi.mock("@/components/Pagination/Card", () => ({
  PaginationCard: ({
    type,
    title,
    parentTitle,
    link,
  }: {
    type: "previous" | "next"
    title: string
    parentTitle: string
    link: string
  }) => (
    <div
      data-testid="pagination-card"
      data-type={type}
      data-title={title}
      data-parent-title={parentTitle}
      data-link={link}
    >
      {title}
    </div>
  ),
}))

import { Pagination } from "../index"
import { Page } from "../../../providers"

beforeEach(() => {
  vi.clearAllMocks()
})

describe("render", () => {
  test("renders previous and next pagination cards", () => {
    const { container } = render(<Pagination />)
    expect(container).toBeInTheDocument()
    const paginationCards = container.querySelectorAll(
      "[data-testid='pagination-card']"
    )
    expect(paginationCards).toHaveLength(2)
    expect(paginationCards[0]).toHaveAttribute("data-type", "previous")
    expect(paginationCards[0]).toHaveAttribute("data-title", "Previous")
    expect(paginationCards[0]).toHaveAttribute("data-parent-title", "Parent")
    expect(paginationCards[0]).toHaveAttribute("data-link", "/previous")
    expect(paginationCards[1]).toHaveAttribute("data-type", "next")
    expect(paginationCards[1]).toHaveAttribute("data-title", "Next")
    expect(paginationCards[1]).toHaveAttribute("data-parent-title", "Parent")
    expect(paginationCards[1]).toHaveAttribute("data-link", "/next")
  })

  test("don't render previous card when previousPage is not set", () => {
    mockUsePagination.mockReturnValue({
      previousPage: null,
      nextPage,
    })
    const { container } = render(<Pagination />)
    expect(container).toBeInTheDocument()
    const paginationCards = container.querySelectorAll(
      "[data-testid='pagination-card']"
    )
    expect(paginationCards).toHaveLength(1)
    expect(paginationCards[0]).toHaveAttribute("data-type", "next")
    expect(paginationCards[0]).toHaveAttribute("data-title", "Next")
    expect(paginationCards[0]).toHaveAttribute("data-parent-title", "Parent")
    expect(paginationCards[0]).toHaveAttribute("data-link", "/next")
  })

  test("don't render next card when nextPage is not set", () => {
    mockUsePagination.mockReturnValue({
      previousPage,
      nextPage: null,
    })
    const { container } = render(<Pagination />)
    expect(container).toBeInTheDocument()
    const paginationCards = container.querySelectorAll(
      "[data-testid='pagination-card']"
    )
    expect(paginationCards).toHaveLength(1)
    expect(paginationCards[0]).toHaveAttribute("data-type", "previous")
    expect(paginationCards[0]).toHaveAttribute("data-title", "Previous")
    expect(paginationCards[0]).toHaveAttribute("data-parent-title", "Parent")
    expect(paginationCards[0]).toHaveAttribute("data-link", "/previous")
  })
})
