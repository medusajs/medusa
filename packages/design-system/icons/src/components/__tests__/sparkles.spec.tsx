  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Sparkles from "../sparkles"

  describe("Sparkles", () => {
    it("should render the icon without errors", async () => {
      render(<Sparkles data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })