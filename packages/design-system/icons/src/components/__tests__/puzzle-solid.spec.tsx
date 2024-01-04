  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import PuzzleSolid from "../puzzle-solid"

  describe("PuzzleSolid", () => {
    it("should render the icon without errors", async () => {
      render(<PuzzleSolid data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })