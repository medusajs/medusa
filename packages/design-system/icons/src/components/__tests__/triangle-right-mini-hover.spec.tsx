  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import TriangleRightMiniHover from "../triangle-right-mini-hover"

  describe("TriangleRightMiniHover", () => {
    it("should render the icon without errors", async () => {
      render(<TriangleRightMiniHover data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })