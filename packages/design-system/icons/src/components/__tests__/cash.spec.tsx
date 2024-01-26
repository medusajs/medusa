  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Cash from "../cash"

  describe("Cash", () => {
    it("should render the icon without errors", async () => {
      render(<Cash data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })