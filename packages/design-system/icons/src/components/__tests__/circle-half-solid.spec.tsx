  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import CircleHalfSolid from "../circle-half-solid"

  describe("CircleHalfSolid", () => {
    it("should render without crashing", async () => {
      render(<CircleHalfSolid data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })