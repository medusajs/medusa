  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import PenPlus from "../pen-plus"

  describe("PenPlus", () => {
    it("should render the icon without errors", async () => {
      render(<PenPlus data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })