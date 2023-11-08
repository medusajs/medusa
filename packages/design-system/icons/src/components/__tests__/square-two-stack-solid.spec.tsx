  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import SquareTwoStackSolid from "../square-two-stack-solid"

  describe("SquareTwoStackSolid", () => {
    it("should render without crashing", async () => {
      render(<SquareTwoStackSolid data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })