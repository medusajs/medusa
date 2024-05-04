  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import ArrowsPointingOut from "../arrows-pointing-out"

  describe("ArrowsPointingOut", () => {
    it("should render the icon without errors", async () => {
      render(<ArrowsPointingOut data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })