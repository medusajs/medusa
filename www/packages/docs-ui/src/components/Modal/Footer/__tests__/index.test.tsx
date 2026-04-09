import React from "react"
import { describe, expect, test, vi } from "vitest"
import { render } from "@testing-library/react"
import { ButtonProps } from "../../../Button"

// mock components
vi.mock("@/components/Button", () => ({
  Button: (props: ButtonProps) => <button {...props} data-testid="button" />,
}))

import { ModalFooter } from "../index"

describe("renders", () => {
  test("renders with default props", () => {
    const { container } = render(<ModalFooter>Footer</ModalFooter>)
    expect(container).toBeInTheDocument()
    expect(container).toHaveTextContent("Footer")
  })

  test("renders with actions", () => {
    const { container } = render(
      <ModalFooter actions={[{ children: "Button" }]} />
    )
    expect(container).toBeInTheDocument()
    const buttons = container.querySelectorAll("[data-testid='button']")
    expect(buttons).toHaveLength(1)
    expect(buttons[0]).toHaveTextContent("Button")
  })

  test("renders with className", () => {
    const { container } = render(<ModalFooter className="test-class" />)
    expect(container).toBeInTheDocument()
    const div = container.querySelector("div")
    expect(div).toHaveClass("test-class")
  })
})
