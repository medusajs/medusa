  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import ArrowLongDown from "../arrow-long-down"

  describe("ArrowLongDown", () => {
    it("should render without crashing", async () => {
      render(<ArrowLongDown data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })