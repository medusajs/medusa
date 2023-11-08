  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import ArrowUpRightMini from "../arrow-up-right-mini"

  describe("ArrowUpRightMini", () => {
    it("should render without crashing", async () => {
      render(<ArrowUpRightMini data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })