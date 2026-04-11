  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import LayoutRight from "../layout-right"

  describe("LayoutRight", () => {
    it("should render the icon without errors", async () => {
      render(<LayoutRight data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })