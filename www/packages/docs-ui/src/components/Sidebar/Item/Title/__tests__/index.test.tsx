import React from "react"
import { afterEach, describe, expect, test, vi } from "vitest"
import { render, waitFor } from "@testing-library/react"

import { SidebarItemTitle } from "../"

const setElementWidths = (scrollWidth: number, clientWidth: number) => {
  Object.defineProperty(HTMLElement.prototype, "scrollWidth", {
    configurable: true,
    value: scrollWidth,
  })
  Object.defineProperty(HTMLElement.prototype, "clientWidth", {
    configurable: true,
    value: clientWidth,
  })
}

afterEach(() => {
  vi.restoreAllMocks()
  setElementWidths(0, 0)
})

describe("SidebarItemTitle", () => {
  test("renders the title", () => {
    const { container } = render(
      <SidebarItemTitle title="Products" isTitleOneWord={true} />
    )
    const title = container.querySelector("[data-testid='sidebar-item-title']")
    expect(title).toBeInTheDocument()
    expect(title).toHaveTextContent("Products")
  })

  test("applies truncate for single-word titles", () => {
    const { container } = render(
      <SidebarItemTitle title="Products" isTitleOneWord={true} />
    )
    const title = container.querySelector("[data-testid='sidebar-item-title']")
    expect(title).toHaveClass("truncate")
  })

  test("resets overscroll behavior on truncated titles so they don't trap sidebar scroll", () => {
    const { container } = render(
      <SidebarItemTitle title="Products" isTitleOneWord={true} />
    )
    const title = container.querySelector("[data-testid='sidebar-item-title']")
    expect(title).toHaveClass("overscroll-y-auto")
  })

  test("does not apply overscroll reset for multi-word (non-truncated) titles", () => {
    const { container } = render(
      <SidebarItemTitle title="Sales Channels" isTitleOneWord={false} />
    )
    const title = container.querySelector("[data-testid='sidebar-item-title']")
    expect(title).not.toHaveClass("overscroll-y-auto")
  })

  test("does not apply truncate for multi-word titles", () => {
    const { container } = render(
      <SidebarItemTitle title="Sales Channels" isTitleOneWord={false} />
    )
    const title = container.querySelector("[data-testid='sidebar-item-title']")
    expect(title).not.toHaveClass("truncate")
  })

  test("applies the passed className", () => {
    const { container } = render(
      <SidebarItemTitle
        title="Products"
        isTitleOneWord={true}
        className="pl-docs_1.5"
      />
    )
    const title = container.querySelector("[data-testid='sidebar-item-title']")
    expect(title).toHaveClass("pl-docs_1.5")
  })

  test("does not show a tooltip when the title is not truncated", () => {
    setElementWidths(50, 100)
    const { container } = render(
      <SidebarItemTitle title="Products" isTitleOneWord={true} />
    )
    const title = container.querySelector("[data-testid='sidebar-item-title']")
    expect(title).not.toHaveAttribute("data-tooltip-id")
  })

  test("shows a tooltip with the full title when truncated", async () => {
    setElementWidths(200, 100)
    const { container } = render(
      <SidebarItemTitle title="VeryLongSingleWordTitle" isTitleOneWord={true} />
    )
    const title = container.querySelector("[data-testid='sidebar-item-title']")
    await waitFor(() => {
      expect(title).toHaveAttribute("data-tooltip-id")
      expect(title).toHaveAttribute(
        "data-tooltip-content",
        "VeryLongSingleWordTitle"
      )
    })
  })
})
