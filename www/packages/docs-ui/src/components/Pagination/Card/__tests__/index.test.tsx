import React from "react"
import { describe, expect, test, vi } from "vitest"
import { render } from "@testing-library/react"
import { PaginationCard } from "../index"

describe("render", () => {
  test("renders previous pagination card", () => {
    const { container } = render(
      <PaginationCard type="previous" title="Previous" link="/previous" />
    )
    expect(container).toBeInTheDocument()
    const paginationCardLink = container.querySelector(
      "[data-testid='pagination-card-link']"
    )
    expect(paginationCardLink).toBeInTheDocument()
    expect(paginationCardLink).toHaveAttribute("href", "/previous")
    const paginationCardPrevIcon = container.querySelector(
      "[data-testid='pagination-card-previous-icon']"
    )
    expect(paginationCardPrevIcon).toBeInTheDocument()
    const paginationCardTitleWrapper = container.querySelector(
      "[data-testid='pagination-card-title-wrapper']"
    )
    expect(paginationCardTitleWrapper).toBeInTheDocument()
    expect(paginationCardTitleWrapper).toHaveClass("text-left")
    const paginationCardParentTitle = container.querySelector(
      "[data-testid='pagination-card-parent-title']"
    )
    expect(paginationCardParentTitle).not.toBeInTheDocument()
    const paginationCardTitle = container.querySelector(
      "[data-testid='pagination-card-title']"
    )
    expect(paginationCardTitle).toBeInTheDocument()
    expect(paginationCardTitle).toHaveTextContent("Previous")
    const paginationCardNextIcon = container.querySelector(
      "[data-testid='pagination-card-next-icon']"
    )
    expect(paginationCardNextIcon).not.toBeInTheDocument()
  })

  test("renders next pagination card", () => {
    const { container } = render(
      <PaginationCard type="next" title="Next" link="/next" />
    )
    expect(container).toBeInTheDocument()
    const paginationCardLink = container.querySelector(
      "[data-testid='pagination-card-link']"
    )
    expect(paginationCardLink).toBeInTheDocument()
    expect(paginationCardLink).toHaveAttribute("href", "/next")
    const paginationCardNextIcon = container.querySelector(
      "[data-testid='pagination-card-next-icon']"
    )
    expect(paginationCardNextIcon).toBeInTheDocument()
    expect(paginationCardNextIcon).toHaveClass("text-medusa-fg-muted")
    const paginationCardTitleWrapper = container.querySelector(
      "[data-testid='pagination-card-title-wrapper']"
    )
    expect(paginationCardTitleWrapper).toBeInTheDocument()
    expect(paginationCardTitleWrapper).toHaveClass("text-right")
    const paginationCardParentTitle = container.querySelector(
      "[data-testid='pagination-card-parent-title']"
    )
    expect(paginationCardParentTitle).not.toBeInTheDocument()
    const paginationCardTitle = container.querySelector(
      "[data-testid='pagination-card-title']"
    )
    expect(paginationCardTitle).toBeInTheDocument()
    expect(paginationCardTitle).toHaveTextContent("Next")
    const paginationCardPreviousIcon = container.querySelector(
      "[data-testid='pagination-card-previous-icon']"
    )
    expect(paginationCardPreviousIcon).not.toBeInTheDocument()
  })

  test("renders pagination card with parent title", () => {
    const { container } = render(
      <PaginationCard
        type="previous"
        title="Previous"
        parentTitle="Parent"
        link="/previous"
      />
    )
    expect(container).toBeInTheDocument()
    const paginationCardParentTitle = container.querySelector(
      "[data-testid='pagination-card-parent-title']"
    )
    expect(paginationCardParentTitle).toBeInTheDocument()
    expect(paginationCardParentTitle).toHaveTextContent("Parent")
  })

  test("renders pagination card with custom class name", () => {
    const { container } = render(
      <PaginationCard
        type="previous"
        title="Previous"
        link="/previous"
        className="custom-class"
      />
    )
    expect(container).toBeInTheDocument()
    const paginationCard = container.querySelector(
      "[data-testid='pagination-card']"
    )
    expect(paginationCard).toBeInTheDocument()
    expect(paginationCard).toHaveClass("custom-class")
  })
})
