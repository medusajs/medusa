  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Focus from "../focus"

  describe("Focus", () => {
    it("should render the icon without errors", async () => {
      render(<Focus data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })