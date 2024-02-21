  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Stopwatch from "../stopwatch"

  describe("Stopwatch", () => {
    it("should render the icon without errors", async () => {
      render(<Stopwatch data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })