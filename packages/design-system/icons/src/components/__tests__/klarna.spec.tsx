  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Klarna from "../klarna"

  describe("Klarna", () => {
    it("should render the icon without errors", async () => {
      render(<Klarna data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })