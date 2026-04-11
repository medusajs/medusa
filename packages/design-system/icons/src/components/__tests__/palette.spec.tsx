  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Palette from "../palette"

  describe("Palette", () => {
    it("should render the icon without errors", async () => {
      render(<Palette data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })