  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import SwatchSolid from "../swatch-solid"

  describe("SwatchSolid", () => {
    it("should render the icon without errors", async () => {
      render(<SwatchSolid data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })