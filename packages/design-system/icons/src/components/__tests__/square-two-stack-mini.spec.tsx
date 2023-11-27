  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import SquareTwoStackMini from "../square-two-stack-mini"

  describe("SquareTwoStackMini", () => {
    it("should render without crashing", async () => {
      render(<SquareTwoStackMini data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })