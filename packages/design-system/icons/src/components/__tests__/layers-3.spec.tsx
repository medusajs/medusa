  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Layers3 from "../layers-3"

  describe("Layers3", () => {
    it("should render the icon without errors", async () => {
      render(<Layers3 data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })