  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Images from "../images"

  describe("Images", () => {
    it("should render the icon without errors", async () => {
      render(<Images data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })