  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Heart from "../heart"

  describe("Heart", () => {
    it("should render the icon without errors", async () => {
      render(<Heart data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })