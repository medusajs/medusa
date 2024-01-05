  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import ClockSolid from "../clock-solid"

  describe("ClockSolid", () => {
    it("should render without crashing", async () => {
      render(<ClockSolid data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })