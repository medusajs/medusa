  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import EllipseBlueSolid from "../ellipse-blue-solid"

  describe("EllipseBlueSolid", () => {
    it("should render without crashing", async () => {
      render(<EllipseBlueSolid data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })