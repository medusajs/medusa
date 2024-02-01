  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import AtSymbol from "../at-symbol"

  describe("AtSymbol", () => {
    it("should render the icon without errors", async () => {
      render(<AtSymbol data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })