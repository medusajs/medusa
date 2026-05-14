  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import MarginLeft from "../margin-left"

  describe("MarginLeft", () => {
    it("should render the icon without errors", async () => {
      render(<MarginLeft data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })