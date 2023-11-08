  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import JavascriptEx from "../javascript-ex"

  describe("JavascriptEx", () => {
    it("should render without crashing", async () => {
      render(<JavascriptEx data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })