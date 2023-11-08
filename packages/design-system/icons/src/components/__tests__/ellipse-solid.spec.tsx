  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import EllipseSolid from "../ellipse-solid"

  describe("EllipseSolid", () => {
    it("should render without crashing", async () => {
      render(<EllipseSolid data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })