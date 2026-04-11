  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import LayoutTop from "../layout-top"

  describe("LayoutTop", () => {
    it("should render the icon without errors", async () => {
      render(<LayoutTop data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })