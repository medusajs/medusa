  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import ArrowDownLeftMini from "../arrow-down-left-mini"

  describe("ArrowDownLeftMini", () => {
    it("should render without crashing", async () => {
      render(<ArrowDownLeftMini data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })