  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import ArrowPathMini from "../arrow-path-mini"

  describe("ArrowPathMini", () => {
    it("should render the icon without errors", async () => {
      render(<ArrowPathMini data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })