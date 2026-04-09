  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import StopCircleSolid from "../stop-circle-solid"

  describe("StopCircleSolid", () => {
    it("should render the icon without errors", async () => {
      render(<StopCircleSolid data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })