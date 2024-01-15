  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import PaperClip from "../paper-clip"

  describe("PaperClip", () => {
    it("should render the icon without errors", async () => {
      render(<PaperClip data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })