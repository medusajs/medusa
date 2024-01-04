  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Figma from "../figma"

  describe("Figma", () => {
    it("should render the icon without errors", async () => {
      render(<Figma data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })