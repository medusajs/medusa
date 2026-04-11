  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import ImageSparkle from "../image-sparkle"

  describe("ImageSparkle", () => {
    it("should render the icon without errors", async () => {
      render(<ImageSparkle data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })