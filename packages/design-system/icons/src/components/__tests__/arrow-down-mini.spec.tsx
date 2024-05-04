  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import ArrowDownMini from "../arrow-down-mini"

  describe("ArrowDownMini", () => {
    it("should render the icon without errors", async () => {
      render(<ArrowDownMini data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })