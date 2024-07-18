  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Trophy from "../trophy"

  describe("Trophy", () => {
    it("should render the icon without errors", async () => {
      render(<Trophy data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })