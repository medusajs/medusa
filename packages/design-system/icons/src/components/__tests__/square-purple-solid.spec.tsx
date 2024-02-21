  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import SquarePurpleSolid from "../square-purple-solid"

  describe("SquarePurpleSolid", () => {
    it("should render the icon without errors", async () => {
      render(<SquarePurpleSolid data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })