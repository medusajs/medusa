  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import EllipseMiniSolid from "../ellipse-mini-solid"

  describe("EllipseMiniSolid", () => {
    it("should render without crashing", async () => {
      render(<EllipseMiniSolid data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })