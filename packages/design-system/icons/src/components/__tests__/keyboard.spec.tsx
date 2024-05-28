  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Keyboard from "../keyboard"

  describe("Keyboard", () => {
    it("should render the icon without errors", async () => {
      render(<Keyboard data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })