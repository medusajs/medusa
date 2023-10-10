import { render, screen } from "@testing-library/react"
import * as React from "react"

import { Checkbox } from "./checkbox"

describe("Checkbox", () => {
  it("renders a checkbox", () => {
    render(<Checkbox />)

    expect(screen.getByRole("checkbox")).toBeInTheDocument()
  })
})
