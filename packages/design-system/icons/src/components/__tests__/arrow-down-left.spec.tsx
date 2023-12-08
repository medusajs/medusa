  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import ArrowDownLeft from "../arrow-down-left"

  describe("ArrowDownLeft", () => {
    it("should render without crashing", async () => {
      render(<ArrowDownLeft data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })