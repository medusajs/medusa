  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import MagnifyingGlass from "../magnifying-glass"

  describe("MagnifyingGlass", () => {
    it("should render without crashing", async () => {
      render(<MagnifyingGlass data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })