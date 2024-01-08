  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import ArrowLongRight from "../arrow-long-right"

  describe("ArrowLongRight", () => {
    it("should render the icon without errors", async () => {
      render(<ArrowLongRight data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })