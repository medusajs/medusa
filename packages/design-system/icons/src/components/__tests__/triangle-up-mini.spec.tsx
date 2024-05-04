  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import TriangleUpMini from "../triangle-up-mini"

  describe("TriangleUpMini", () => {
    it("should render the icon without errors", async () => {
      render(<TriangleUpMini data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })