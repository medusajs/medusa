  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import ChartPie from "../chart-pie"

  describe("ChartPie", () => {
    it("should render the icon without errors", async () => {
      render(<ChartPie data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })