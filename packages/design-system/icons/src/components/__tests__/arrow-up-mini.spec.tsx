  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import ArrowUpMini from "../arrow-up-mini"

  describe("ArrowUpMini", () => {
    it("should render without crashing", async () => {
      render(<ArrowUpMini data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })