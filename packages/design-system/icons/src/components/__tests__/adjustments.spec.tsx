  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Adjustments from "../adjustments"

  describe("Adjustments", () => {
    it("should render without crashing", async () => {
      render(<Adjustments data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })