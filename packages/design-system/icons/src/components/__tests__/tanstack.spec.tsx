  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Tanstack from "../tanstack"

  describe("Tanstack", () => {
    it("should render the icon without errors", async () => {
      render(<Tanstack data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })