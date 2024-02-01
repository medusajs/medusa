  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import EllipsePurpleSolid from "../ellipse-purple-solid"

  describe("EllipsePurpleSolid", () => {
    it("should render the icon without errors", async () => {
      render(<EllipsePurpleSolid data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })