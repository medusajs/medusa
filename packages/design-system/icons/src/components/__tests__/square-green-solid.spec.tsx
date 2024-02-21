  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import SquareGreenSolid from "../square-green-solid"

  describe("SquareGreenSolid", () => {
    it("should render the icon without errors", async () => {
      render(<SquareGreenSolid data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })