  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import ArrowDownLeft from "../arrow-down-left"

  describe("ArrowDownLeft", () => {
    it("should render the icon without errors", async () => {
      render(<ArrowDownLeft data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })