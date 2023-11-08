  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import CursorArrowRays from "../cursor-arrow-rays"

  describe("CursorArrowRays", () => {
    it("should render without crashing", async () => {
      render(<CursorArrowRays data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })