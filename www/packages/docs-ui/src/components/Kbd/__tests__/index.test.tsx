import React from "react"
import { describe, expect, test } from "vitest"
import { render } from "@testing-library/react"

import { Kbd } from "../../Kbd"

describe("rendering", () => {
  test("renders with default variant", () => {
    const { container } = render(<Kbd>Ctrl</Kbd>)
    const kbd = container.querySelector("kbd")
    expect(kbd).toBeInTheDocument()
    expect(kbd).toHaveTextContent("Ctrl")
    expect(kbd).toHaveClass("text-compact-x-small-plus")
  })

  test("renders with small variant", () => {
    const { container } = render(<Kbd variant="small">esc</Kbd>)
    const kbd = container.querySelector("kbd")
    expect(kbd).toBeInTheDocument()
    expect(kbd).toHaveTextContent("esc")
    expect(kbd).toHaveClass("text-compact-x-small")
  })

  test("applies custom className", () => {
    const { container } = render(<Kbd className="custom-class">Ctrl</Kbd>)
    const kbd = container.querySelector("kbd")
    expect(kbd).toHaveClass("custom-class")
  })

  test("passes through other props", () => {
    const { container } = render(<Kbd data-testid="kbd-test">Ctrl</Kbd>)
    const kbd = container.querySelector("kbd")
    expect(kbd).toHaveAttribute("data-testid", "kbd-test")
  })
})
