  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Ellipse from "../ellipse"

  describe("Ellipse", () => {
    it("should render the icon without errors", async () => {
      render(<Ellipse data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })