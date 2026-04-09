  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import PaperPlane from "../paper-plane"

  describe("PaperPlane", () => {
    it("should render the icon without errors", async () => {
      render(<PaperPlane data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })