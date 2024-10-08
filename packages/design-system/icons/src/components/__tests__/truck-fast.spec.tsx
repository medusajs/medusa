  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import TruckFast from "../truck-fast"

  describe("TruckFast", () => {
    it("should render the icon without errors", async () => {
      render(<TruckFast data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })