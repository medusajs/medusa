  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Glasses from "../glasses"

  describe("Glasses", () => {
    it("should render the icon without errors", async () => {
      render(<Glasses data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })