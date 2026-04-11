import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { fireEvent, render } from "@testing-library/react"

// mock data
const mockAction = vi.fn()
const mockItem = {
  type: "action" as const,
  title: "Test Action",
  action: mockAction,
  icon: <span data-testid="action-icon">Icon</span>,
  shortcut: "Ctrl+K",
}

// mock functions
const mockOnClick = vi.fn()

import { MenuAction } from "../../Action"

beforeEach(() => {
  vi.clearAllMocks()
})

describe("rendering", () => {
  test("renders action item", () => {
    const { container } = render(<MenuAction item={mockItem} />)
    const action = container.querySelector("[data-testid='menu-action']")
    expect(action).toBeInTheDocument()
    expect(action).toHaveTextContent("Test Action")
    const icon = container.querySelector("[data-testid='action-icon']")
    expect(icon).toBeInTheDocument()
    const shortcut = container.querySelector(
      "[data-testid='menu-action-shortcut']"
    )
    expect(shortcut).toBeInTheDocument()
    expect(shortcut).toHaveTextContent("Ctrl+K")
  })

  test("does not render shortcut when not provided", () => {
    const itemWithoutShortcut = {
      ...mockItem,
      shortcut: undefined,
    }
    const { container } = render(<MenuAction item={itemWithoutShortcut} />)
    const shortcut = container.querySelector(
      "[data-testid='menu-action-shortcut']"
    )
    expect(shortcut).not.toBeInTheDocument()
  })
})

describe("interaction", () => {
  test("calls item.action when clicked", () => {
    const { container } = render(<MenuAction item={mockItem} />)
    const action = container.querySelector("[data-testid='menu-action']")
    fireEvent.click(action!)
    expect(mockAction).toHaveBeenCalledTimes(1)
  })

  test("calls onClick callback when provided", () => {
    const { container } = render(
      <MenuAction item={mockItem} onClick={mockOnClick} />
    )
    const action = container.querySelector("[data-testid='menu-action']")
    fireEvent.click(action!)
    expect(mockOnClick).toHaveBeenCalledWith(mockItem)
  })

  test("calls both item.action and onClick when both are provided", () => {
    const { container } = render(
      <MenuAction item={mockItem} onClick={mockOnClick} />
    )
    const action = container.querySelector("[data-testid='menu-action']")
    fireEvent.click(action!)
    expect(mockAction).toHaveBeenCalledTimes(1)
    expect(mockOnClick).toHaveBeenCalledWith(mockItem)
  })
})
