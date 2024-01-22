  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import TrianglesMini from "../triangles-mini"

  describe("TrianglesMini", () => {
    it("should render the icon without errors", async () => {
      render(<TrianglesMini data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })