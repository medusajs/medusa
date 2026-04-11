  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import GridLayout from "../grid-layout"

  describe("GridLayout", () => {
    it("should render the icon without errors", async () => {
      render(<GridLayout data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })