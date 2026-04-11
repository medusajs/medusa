  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import LayoutBottom from "../layout-bottom"

  describe("LayoutBottom", () => {
    it("should render the icon without errors", async () => {
      render(<LayoutBottom data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })