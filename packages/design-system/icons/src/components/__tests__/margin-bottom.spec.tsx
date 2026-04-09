  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import MarginBottom from "../margin-bottom"

  describe("MarginBottom", () => {
    it("should render the icon without errors", async () => {
      render(<MarginBottom data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })