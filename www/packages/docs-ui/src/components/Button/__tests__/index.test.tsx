import React from "react"
import { describe, expect, test, vi } from "vitest"
import { render } from "@testing-library/react"
import { Button } from "../../Button"

describe("rendering", () => {
  test("renders primary button", () => {
    const { container } = render(<Button variant="primary">Click me</Button>)
    expect(container).toBeInTheDocument()
    const button = container.querySelector("button")
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass("bg-medusa-button-inverted")
    expect(button).toHaveClass("hover:bg-medusa-button-inverted-hover")
    expect(button).toHaveClass("active:bg-medusa-button-inverted-pressed")
    expect(button).toHaveClass("focus:bg-medusa-button-inverted")
    expect(button).toHaveClass("shadow-button-inverted")
    expect(button).toHaveClass("dark:shadow-button-inverted-dark")
    expect(button).toHaveClass("dark:focus:shadow-button-inverted-focused-dark")
    expect(button).toHaveClass("disabled:bg-medusa-bg-disabled")
    expect(button).toHaveClass("disabled:shadow-button-neutral")
    expect(button).toHaveClass("disabled:shadow-button-neutral")
  })

  test("renders secondary button", () => {
    const { container } = render(<Button variant="secondary">Click me</Button>)
    expect(container).toBeInTheDocument()
    const button = container.querySelector("button")
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass("bg-medusa-button-neutral")
    expect(button).toHaveClass("hover:bg-medusa-button-neutral-hover")
    expect(button).toHaveClass("active:bg-medusa-button-neutral-pressed")
    expect(button).toHaveClass("focus:bg-medusa-button-neutral")
    expect(button).toHaveClass("shadow-button-neutral")
    expect(button).toHaveClass("dark:shadow-button-neutral")
  })

  test("renders transparent button", () => {
    const { container } = render(
      <Button variant="transparent">Click me</Button>
    )
    expect(container).toBeInTheDocument()
    const button = container.querySelector("button")
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass("bg-transparent")
    expect(button).toHaveClass("shadow-none")
    expect(button).toHaveClass("border-0")
    expect(button).toHaveClass("outline-none")
  })

  test("renders transparent clear button", () => {
    const { container } = render(
      <Button variant="transparent-clear">Click me</Button>
    )
    expect(container).toBeInTheDocument()
    const button = container.querySelector("button")
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass("bg-transparent")
    expect(button).toHaveClass("shadow-none")
    expect(button).toHaveClass("border-0")
    expect(button).toHaveClass("outline-none")
  })

  test("renders icon button", () => {
    const { container } = render(
      <Button variant="primary" buttonType="icon">
        Click me
      </Button>
    )
    expect(container).toBeInTheDocument()
    const button = container.querySelector("button")
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass("!px-docs_0.25")
  })

  test("renders button with custom className", () => {
    const { container } = render(
      <Button className="custom-class">Click me</Button>
    )
    expect(container).toBeInTheDocument()
    const button = container.querySelector("button")
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass("custom-class")
  })

  test("renders button with custom buttonRef", () => {
    const buttonRef = vi.fn()
    render(<Button buttonRef={buttonRef}>Click me</Button>)
    expect(buttonRef).toHaveBeenCalled()
  })
})
