  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import CircleThreeQuartersSolid from "../circle-three-quarters-solid"

  describe("CircleThreeQuartersSolid", () => {
    it("should render the icon without errors", async () => {
      render(<CircleThreeQuartersSolid data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })