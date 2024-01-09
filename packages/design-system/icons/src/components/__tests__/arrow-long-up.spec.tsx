  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import ArrowLongUp from "../arrow-long-up"

  describe("ArrowLongUp", () => {
    it("should render the icon without errors", async () => {
      render(<ArrowLongUp data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })