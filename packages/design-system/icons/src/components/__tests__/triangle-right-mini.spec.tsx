  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import TriangleRightMini from "../triangle-right-mini"

  describe("TriangleRightMini", () => {
    it("should render without crashing", async () => {
      render(<TriangleRightMini data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })