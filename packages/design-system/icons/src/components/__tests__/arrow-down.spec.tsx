  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import ArrowDown from "../arrow-down"

  describe("ArrowDown", () => {
    it("should render without crashing", async () => {
      render(<ArrowDown data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })