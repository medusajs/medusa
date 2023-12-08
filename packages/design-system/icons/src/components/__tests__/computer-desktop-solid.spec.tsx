  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import ComputerDesktopSolid from "../computer-desktop-solid"

  describe("ComputerDesktopSolid", () => {
    it("should render without crashing", async () => {
      render(<ComputerDesktopSolid data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })