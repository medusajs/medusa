  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import ClockChangedSolidMini from "../clock-changed-solid-mini"

  describe("ClockChangedSolidMini", () => {
    it("should render without crashing", async () => {
      render(<ClockChangedSolidMini data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })