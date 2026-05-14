  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import MinusCircle from "../minus-circle"

  describe("MinusCircle", () => {
    it("should render the icon without errors", async () => {
      render(<MinusCircle data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })