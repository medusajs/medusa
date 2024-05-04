  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import EllipseRedSolid from "../ellipse-red-solid"

  describe("EllipseRedSolid", () => {
    it("should render the icon without errors", async () => {
      render(<EllipseRedSolid data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })