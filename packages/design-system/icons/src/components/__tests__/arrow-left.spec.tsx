  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import ArrowLeft from "../arrow-left"

  describe("ArrowLeft", () => {
    it("should render without crashing", async () => {
      render(<ArrowLeft data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })