  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import ArrowUpRightOnBox from "../arrow-up-right-on-box"

  describe("ArrowUpRightOnBox", () => {
    it("should render without crashing", async () => {
      render(<ArrowUpRightOnBox data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })