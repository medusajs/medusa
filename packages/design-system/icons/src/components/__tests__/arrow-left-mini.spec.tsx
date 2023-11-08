  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import ArrowLeftMini from "../arrow-left-mini"

  describe("ArrowLeftMini", () => {
    it("should render without crashing", async () => {
      render(<ArrowLeftMini data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })