  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import ArrowDownTray from "../arrow-down-tray"

  describe("ArrowDownTray", () => {
    it("should render without crashing", async () => {
      render(<ArrowDownTray data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })