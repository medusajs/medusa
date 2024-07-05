  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import SquareOrangeSolid from "../square-orange-solid"

  describe("SquareOrangeSolid", () => {
    it("should render the icon without errors", async () => {
      render(<SquareOrangeSolid data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })