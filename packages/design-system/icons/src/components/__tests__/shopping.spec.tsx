  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Shopping from "../shopping"

  describe("Shopping", () => {
    it("should render the icon without errors", async () => {
      render(<Shopping data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })