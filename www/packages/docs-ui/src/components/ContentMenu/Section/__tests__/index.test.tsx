import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { fireEvent, render, waitFor } from "@testing-library/react"

vi.mock("@/providers/BrowserProvider", () => ({
  useIsBrowser: () => ({ isBrowser: true }),
}))

import { ContentMenuSection } from "../index"

beforeEach(() => {
  localStorage.clear()
})

describe("render", () => {
  test("renders title in bracket format", () => {
    const { container } = render(
      <ContentMenuSection title="On this page">
        <div data-testid="child">Content</div>
      </ContentMenuSection>
    )
    expect(container).toBeInTheDocument()
    expect(container).toHaveTextContent("[On this page]")
  })

  test("renders children when open by default", () => {
    const { container } = render(
      <ContentMenuSection title="Shortcuts">
        <div data-testid="child">Content</div>
      </ContentMenuSection>
    )
    const child = container.querySelector("[data-testid='child']")
    expect(child).toBeInTheDocument()
  })

  test("returns null when children is falsy", () => {
    const { container } = render(
      <ContentMenuSection title="Empty">{null}</ContentMenuSection>
    )
    expect(container.firstChild).toBeNull()
  })
})

describe("toggle", () => {
  test("hides children when header is clicked", async () => {
    const { container } = render(
      <ContentMenuSection title="Shortcuts">
        <div data-testid="child">Content</div>
      </ContentMenuSection>
    )
    const child = container.querySelector("[data-testid='child']")
    expect(child).toBeInTheDocument()

    const header = container.querySelector(
      "[data-testid='content-menu-section-header']"
    ) as HTMLElement
    fireEvent.click(header)

    await waitFor(() => {
      expect(
        container.querySelector("[data-testid='child']")
      ).not.toBeInTheDocument()
    })
  })

  test("shows children again when header is clicked twice", async () => {
    const { container } = render(
      <ContentMenuSection title="Shortcuts">
        <div data-testid="child">Content</div>
      </ContentMenuSection>
    )
    const header = container.querySelector("[data-testid='content-menu-section-header']") as HTMLElement
    fireEvent.click(header)
    fireEvent.click(header)

    await waitFor(() => {
      expect(
        container.querySelector("[data-testid='child']")
      ).toBeInTheDocument()
    })
  })

  test("persists open state to localStorage when toggled", async () => {
    const { container } = render(
      <ContentMenuSection title="Shortcuts">
        <div data-testid="child">Content</div>
      </ContentMenuSection>
    )
    const header = container.querySelector("[data-testid='content-menu-section-header']") as HTMLElement
    fireEvent.click(header)

    await waitFor(() => {
      expect(localStorage.getItem("content-menu-section-shortcuts")).toBe(
        "false"
      )
    })
  })

  test("reads closed state from localStorage on mount", async () => {
    localStorage.setItem("content-menu-section-shortcuts", "false")
    const { container } = render(
      <ContentMenuSection title="Shortcuts">
        <div data-testid="child">Content</div>
      </ContentMenuSection>
    )

    await waitFor(() => {
      expect(
        container.querySelector("[data-testid='child']")
      ).not.toBeInTheDocument()
    })
  })

  test("reads open state from localStorage on mount", async () => {
    localStorage.setItem("content-menu-section-shortcuts", "true")
    const { container } = render(
      <ContentMenuSection title="Shortcuts">
        <div data-testid="child">Content</div>
      </ContentMenuSection>
    )

    await waitFor(() => {
      expect(
        container.querySelector("[data-testid='child']")
      ).toBeInTheDocument()
    })
  })
})
