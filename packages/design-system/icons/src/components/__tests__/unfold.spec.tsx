  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Unfold from "../unfold"

  describe("Unfold", () => {
    it("should render the icon without errors", async () => {
      render(<Unfold data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })