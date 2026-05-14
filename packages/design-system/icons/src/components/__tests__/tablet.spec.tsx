  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Tablet from "../tablet"

  describe("Tablet", () => {
    it("should render the icon without errors", async () => {
      render(<Tablet data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })