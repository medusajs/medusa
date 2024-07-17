  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import History from "../history"

  describe("History", () => {
    it("should render the icon without errors", async () => {
      render(<History data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })