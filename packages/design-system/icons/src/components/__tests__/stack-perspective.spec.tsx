  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import StackPerspective from "../stack-perspective"

  describe("StackPerspective", () => {
    it("should render the icon without errors", async () => {
      render(<StackPerspective data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })