  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import EllipseOrangeSolid from "../ellipse-orange-solid"

  describe("EllipseOrangeSolid", () => {
    it("should render without crashing", async () => {
      render(<EllipseOrangeSolid data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })