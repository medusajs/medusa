  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import MagnifyingGlassMini from "../magnifying-glass-mini"

  describe("MagnifyingGlassMini", () => {
    it("should render without crashing", async () => {
      render(<MagnifyingGlassMini data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })