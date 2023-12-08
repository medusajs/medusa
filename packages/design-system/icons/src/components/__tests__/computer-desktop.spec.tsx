  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import ComputerDesktop from "../computer-desktop"

  describe("ComputerDesktop", () => {
    it("should render without crashing", async () => {
      render(<ComputerDesktop data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })