  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import ArrowUpRightMicro from "../arrow-up-right-micro"

  describe("ArrowUpRightMicro", () => {
    it("should render the icon without errors", async () => {
      render(<ArrowUpRightMicro data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })