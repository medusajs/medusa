  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import PinTack from "../pin-tack"

  describe("PinTack", () => {
    it("should render the icon without errors", async () => {
      render(<PinTack data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })