  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import ArrowTurnUp from "../arrow-turn-up"

  describe("ArrowTurnUp", () => {
    it("should render the icon without errors", async () => {
      render(<ArrowTurnUp data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })