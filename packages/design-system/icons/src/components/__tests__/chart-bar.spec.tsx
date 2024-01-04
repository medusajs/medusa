  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import ChartBar from "../chart-bar"

  describe("ChartBar", () => {
    it("should render without crashing", async () => {
      render(<ChartBar data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })