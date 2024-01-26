  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Swatch from "../swatch"

  describe("Swatch", () => {
    it("should render the icon without errors", async () => {
      render(<Swatch data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })