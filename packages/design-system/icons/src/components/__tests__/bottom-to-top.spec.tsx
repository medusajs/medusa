  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import BottomToTop from "../bottom-to-top"

  describe("BottomToTop", () => {
    it("should render the icon without errors", async () => {
      render(<BottomToTop data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })