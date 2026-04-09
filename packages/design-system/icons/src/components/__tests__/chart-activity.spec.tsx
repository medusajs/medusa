  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import ChartActivity from "../chart-activity"

  describe("ChartActivity", () => {
    it("should render the icon without errors", async () => {
      render(<ChartActivity data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })