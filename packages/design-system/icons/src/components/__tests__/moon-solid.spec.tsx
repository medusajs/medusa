  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import MoonSolid from "../moon-solid"

  describe("MoonSolid", () => {
    it("should render the icon without errors", async () => {
      render(<MoonSolid data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })