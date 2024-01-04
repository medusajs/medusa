  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import ForwardSolid from "../forward-solid"

  describe("ForwardSolid", () => {
    it("should render without crashing", async () => {
      render(<ForwardSolid data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })