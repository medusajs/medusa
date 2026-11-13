import { render, screen } from "@testing-library/react"
import * as React from "react"

import { Toast } from "./toast"

describe("Toast", () => {
  it("should give the dismiss button an accessible name", () => {
    render(<Toast id="toast" title="Payment failed" dismissable />)

    expect(
      screen.getByRole("button", { name: "Dismiss" })
    ).toBeInTheDocument()
  })

  it("should not render a dismiss button when the toast isn't dismissable", () => {
    render(<Toast id="toast" title="Payment failed" dismissable={false} />)

    expect(screen.queryByRole("button")).not.toBeInTheDocument()
  })
})
