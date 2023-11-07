  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import KlarnaEx from "../klarna-ex"

  describe("KlarnaEx", () => {
    it("should render without crashing", async () => {
      render(<KlarnaEx data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })