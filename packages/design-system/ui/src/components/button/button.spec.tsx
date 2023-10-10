import { render, screen } from "@testing-library/react"
import * as React from "react"

import { Button } from "./button"

describe("Button", () => {
  it("renders a button", () => {
    render(<Button>Click me</Button>)
    const button = screen.getByRole("button", { name: "Click me" })
    expect(button).toBeInTheDocument()
  })

  it("renders a button as a link", () => {
    render(
      <Button asChild>
        <a href="https://www.medusajs.com">Go to website</a>
      </Button>
    )

    const button = screen.getByRole("link", { name: "Go to website" })
    expect(button).toBeInTheDocument()
  })
})
