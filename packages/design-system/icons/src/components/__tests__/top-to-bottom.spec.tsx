  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import TopToBottom from "../top-to-bottom"

  describe("TopToBottom", () => {
    it("should render the icon without errors", async () => {
      render(<TopToBottom data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })