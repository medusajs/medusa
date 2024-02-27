  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Klaviyo from "../klaviyo"

  describe("Klaviyo", () => {
    it("should render the icon without errors", async () => {
      render(<Klaviyo data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })