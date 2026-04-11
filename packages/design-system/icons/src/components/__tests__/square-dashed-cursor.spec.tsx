  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import SquareDashedCursor from "../square-dashed-cursor"

  describe("SquareDashedCursor", () => {
    it("should render the icon without errors", async () => {
      render(<SquareDashedCursor data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })