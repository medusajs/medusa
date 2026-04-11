  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import MarginTopBottom from "../margin-top-bottom"

  describe("MarginTopBottom", () => {
    it("should render the icon without errors", async () => {
      render(<MarginTopBottom data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })