  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import AdjustmentsDone from "../adjustments-done"

  describe("AdjustmentsDone", () => {
    it("should render the icon without errors", async () => {
      render(<AdjustmentsDone data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })