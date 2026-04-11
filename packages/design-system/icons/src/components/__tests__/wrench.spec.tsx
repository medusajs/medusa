  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Wrench from "../wrench"

  describe("Wrench", () => {
    it("should render the icon without errors", async () => {
      render(<Wrench data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })