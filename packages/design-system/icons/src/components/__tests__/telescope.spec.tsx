  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Telescope from "../telescope"

  describe("Telescope", () => {
    it("should render the icon without errors", async () => {
      render(<Telescope data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })