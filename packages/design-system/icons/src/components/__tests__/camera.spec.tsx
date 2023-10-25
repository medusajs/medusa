  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Camera from "../camera"

  describe("Camera", () => {
    it("should render without crashing", async () => {
      render(<Camera data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })