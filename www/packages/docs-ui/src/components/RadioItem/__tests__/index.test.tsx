import React from "react"
import { describe, expect, test, vi } from "vitest"
import { fireEvent, render } from "@testing-library/react"
import { RadioItem } from "../index"

describe("render", () => {
  test("renders radio item", () => {
    const { container } = render(<RadioItem />)
    expect(container).toBeInTheDocument()
    const radioItem = container.querySelector("input")
    expect(radioItem).toBeInTheDocument()
    expect(radioItem).toHaveAttribute("type", "radio")
    expect(radioItem?.checked).toBeFalsy()
    expect(radioItem?.disabled).toBeFalsy()
  })

  test("renders radio item with checked", () => {
    const { container } = render(<RadioItem checked />)
    expect(container).toBeInTheDocument()
    const radioItem = container.querySelector("input")
    expect(radioItem).toBeInTheDocument()
    expect(radioItem?.checked).toBeTruthy()
  })

  test("renders indicator when checked", () => {
    const { container } = render(<RadioItem checked />)
    expect(container).toBeInTheDocument()
    const radioItemCheckedIndicator = container.querySelector(
      "[data-testid='radio-item-checked-indicator']"
    )
    expect(radioItemCheckedIndicator).toBeInTheDocument()
  })

  test("doesn't render indicator when not checked", () => {
    const { container } = render(<RadioItem />)
    expect(container).toBeInTheDocument()
    const radioItemCheckedIndicator = container.querySelector(
      "[data-testid='radio-item-checked-indicator']"
    )
    expect(radioItemCheckedIndicator).not.toBeInTheDocument()
  })

  test("renders radio item with disabled", () => {
    const { container } = render(<RadioItem disabled />)
    expect(container).toBeInTheDocument()
    const radioItem = container.querySelector("input")
    expect(radioItem).toBeInTheDocument()
    expect(radioItem?.disabled).toBeTruthy()
  })

  test("renders radio item with name", () => {
    const { container } = render(<RadioItem name="radio" />)
    expect(container).toBeInTheDocument()
    const radioItem = container.querySelector("input")
    expect(radioItem).toBeInTheDocument()
    expect(radioItem).toHaveAttribute("name", "radio")
  })

  test("renders radio item with value", () => {
    const { container } = render(<RadioItem value="radio" />)
    expect(container).toBeInTheDocument()
    const radioItem = container.querySelector("input")
    expect(radioItem).toBeInTheDocument()
    expect(radioItem).toHaveAttribute("value", "radio")
  })
})

describe("interactions", () => {
  test("calls onClick when radio item is clicked", () => {
    const mockOnClick = vi.fn()
    const { container } = render(<RadioItem onClick={mockOnClick} />)
    const radioItem = container.querySelector("input")
    expect(radioItem).toBeInTheDocument()
    fireEvent.click(radioItem!)
    expect(mockOnClick).toHaveBeenCalledTimes(1)
  })
})
