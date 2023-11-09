  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import ArrowDownRightMini from "../arrow-down-right-mini"

  describe("ArrowDownRightMini", () => {
    it("should render without crashing", async () => {
      render(<ArrowDownRightMini data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })