  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Gift from "../gift"

  describe("Gift", () => {
    it("should render the icon without errors", async () => {
      render(<Gift data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })