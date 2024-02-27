  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import TriangleLeftMini from "../triangle-left-mini"

  describe("TriangleLeftMini", () => {
    it("should render the icon without errors", async () => {
      render(<TriangleLeftMini data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })