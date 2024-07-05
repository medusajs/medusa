  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import SquareRedSolid from "../square-red-solid"

  describe("SquareRedSolid", () => {
    it("should render the icon without errors", async () => {
      render(<SquareRedSolid data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })