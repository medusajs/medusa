  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import EllipseSolid from "../ellipse-solid"

  describe("EllipseSolid", () => {
    it("should render the icon without errors", async () => {
      render(<EllipseSolid data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })