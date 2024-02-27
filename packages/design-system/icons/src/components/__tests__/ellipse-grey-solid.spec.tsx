  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import EllipseGreySolid from "../ellipse-grey-solid"

  describe("EllipseGreySolid", () => {
    it("should render the icon without errors", async () => {
      render(<EllipseGreySolid data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })