import * as React from "react"
import { cleanup, render, screen } from "@testing-library/react"

import BellAlertDone from "../bell-alert-done"

describe("BellAlertDone", () => {
  it("should render the icon without errors", async () => {
    render(<BellAlertDone data-testid="icon" />)

    const svgElement = screen.getByTestId("icon")

    expect(svgElement).toBeInTheDocument()

    cleanup()
  })
})
