  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Typography from "../typography"

  describe("Typography", () => {
    it("should render the icon without errors", async () => {
      render(<Typography data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })