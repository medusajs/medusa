  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import BarsArrowDown from "../bars-arrow-down"

  describe("BarsArrowDown", () => {
    it("should render the icon without errors", async () => {
      render(<BarsArrowDown data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })