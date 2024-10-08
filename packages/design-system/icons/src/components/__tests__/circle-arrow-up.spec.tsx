  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import CircleArrowUp from "../circle-arrow-up"

  describe("CircleArrowUp", () => {
    it("should render the icon without errors", async () => {
      render(<CircleArrowUp data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })