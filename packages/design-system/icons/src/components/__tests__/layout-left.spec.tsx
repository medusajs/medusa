  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import LayoutLeft from "../layout-left"

  describe("LayoutLeft", () => {
    it("should render the icon without errors", async () => {
      render(<LayoutLeft data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })