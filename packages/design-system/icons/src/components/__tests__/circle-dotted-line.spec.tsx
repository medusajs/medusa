  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import CircleDottedLine from "../circle-dotted-line"

  describe("CircleDottedLine", () => {
    it("should render without crashing", async () => {
      render(<CircleDottedLine data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })