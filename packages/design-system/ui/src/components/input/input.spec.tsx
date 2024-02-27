import { render, screen } from "@testing-library/react"
import * as React from "react"

import { Input } from "./input"

describe("Input", () => {
  it("should render the component", () => {
    render(<Input />)
    expect(screen.getByRole("textbox")).toBeInTheDocument()
  })
})
