  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import ArrowPath from "../arrow-path"

  describe("ArrowPath", () => {
    it("should render without crashing", async () => {
      render(<ArrowPath data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })