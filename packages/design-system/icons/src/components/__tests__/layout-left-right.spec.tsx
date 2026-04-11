  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import LayoutLeftRight from "../layout-left-right"

  describe("LayoutLeftRight", () => {
    it("should render the icon without errors", async () => {
      render(<LayoutLeftRight data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })