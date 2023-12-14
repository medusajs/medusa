  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import CircleStack from "../circle-stack"

  describe("CircleStack", () => {
    it("should render without crashing", async () => {
      render(<CircleStack data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })