  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import TriangleDownMini from "../triangle-down-mini"

  describe("TriangleDownMini", () => {
    it("should render without crashing", async () => {
      render(<TriangleDownMini data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })