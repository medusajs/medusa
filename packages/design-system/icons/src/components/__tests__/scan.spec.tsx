  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Scan from "../scan"

  describe("Scan", () => {
    it("should render the icon without errors", async () => {
      render(<Scan data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })