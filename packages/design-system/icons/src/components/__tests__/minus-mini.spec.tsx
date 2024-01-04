  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import MinusMini from "../minus-mini"

  describe("MinusMini", () => {
    it("should render the icon without errors", async () => {
      render(<MinusMini data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })