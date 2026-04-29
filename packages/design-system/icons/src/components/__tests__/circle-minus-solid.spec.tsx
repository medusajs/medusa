  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import CircleMinusSolid from "../circle-minus-solid"

  describe("CircleMinusSolid", () => {
    it("should render the icon without errors", async () => {
      render(<CircleMinusSolid data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })