  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Variable from "../variable"

  describe("Variable", () => {
    it("should render the icon without errors", async () => {
      render(<Variable data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })