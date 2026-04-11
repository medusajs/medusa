  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import MarginTop from "../margin-top"

  describe("MarginTop", () => {
    it("should render the icon without errors", async () => {
      render(<MarginTop data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })