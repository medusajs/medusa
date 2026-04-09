  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import ScanText from "../scan-text"

  describe("ScanText", () => {
    it("should render the icon without errors", async () => {
      render(<ScanText data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })