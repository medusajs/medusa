  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import LayoutTopBottom from "../layout-top-bottom"

  describe("LayoutTopBottom", () => {
    it("should render the icon without errors", async () => {
      render(<LayoutTopBottom data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })