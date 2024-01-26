  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import TypescriptEx from "../typescript-ex"

  describe("TypescriptEx", () => {
    it("should render the icon without errors", async () => {
      render(<TypescriptEx data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })