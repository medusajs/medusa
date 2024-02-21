  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import SquareBlueSolid from "../square-blue-solid"

  describe("SquareBlueSolid", () => {
    it("should render the icon without errors", async () => {
      render(<SquareBlueSolid data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })