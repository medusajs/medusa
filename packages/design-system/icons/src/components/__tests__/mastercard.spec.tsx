  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Mastercard from "../mastercard"

  describe("Mastercard", () => {
    it("should render the icon without errors", async () => {
      render(<Mastercard data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })