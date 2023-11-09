import { render, screen } from "@testing-library/react"
import * as React from "react"

import { Switch } from "./switch"

describe("Switch", () => {
  it("should render successfully", () => {
    render(<Switch />)

    expect(screen.getByRole("switch")).toBeInTheDocument()
  })
})
