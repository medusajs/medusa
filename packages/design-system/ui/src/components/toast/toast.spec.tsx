import { render, screen } from "@testing-library/react"
import * as React from "react"

import { Toast } from "./toast"

describe("Toast", () => {
  it("names the dismiss button for screen readers", () => {
    render(<Toast id="toast-1" title="Saved" dismissable />)

    expect(screen.getByRole("button", { name: "Dismiss" })).toBeInTheDocument()
  })
})
