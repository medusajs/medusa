  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import CircleQuarterSolid from "../circle-quarter-solid"

  describe("CircleQuarterSolid", () => {
    it("should render without crashing", async () => {
      render(<CircleQuarterSolid data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })