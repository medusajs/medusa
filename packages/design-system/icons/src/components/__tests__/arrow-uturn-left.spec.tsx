  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import ArrowUturnLeft from "../arrow-uturn-left"

  describe("ArrowUturnLeft", () => {
    it("should render without crashing", async () => {
      render(<ArrowUturnLeft data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })