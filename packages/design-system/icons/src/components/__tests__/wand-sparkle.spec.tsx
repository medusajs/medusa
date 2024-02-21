  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import WandSparkle from "../wand-sparkle"

  describe("WandSparkle", () => {
    it("should render the icon without errors", async () => {
      render(<WandSparkle data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })