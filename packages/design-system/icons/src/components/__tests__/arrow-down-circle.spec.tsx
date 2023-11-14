  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import ArrowDownCircle from "../arrow-down-circle"

  describe("ArrowDownCircle", () => {
    it("should render without crashing", async () => {
      render(<ArrowDownCircle data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })