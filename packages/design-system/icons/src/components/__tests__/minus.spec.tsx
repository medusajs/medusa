  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Minus from "../minus"

  describe("Minus", () => {
    it("should render without crashing", async () => {
      render(<Minus data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })