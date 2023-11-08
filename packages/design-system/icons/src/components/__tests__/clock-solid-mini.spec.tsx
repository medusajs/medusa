  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import ClockSolidMini from "../clock-solid-mini"

  describe("ClockSolidMini", () => {
    it("should render without crashing", async () => {
      render(<ClockSolidMini data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })