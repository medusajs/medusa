  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import ArrowsPointingOutMini from "../arrows-pointing-out-mini"

  describe("ArrowsPointingOutMini", () => {
    it("should render without crashing", async () => {
      render(<ArrowsPointingOutMini data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })