  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import CogSixToothSolid from "../cog-six-tooth-solid"

  describe("CogSixToothSolid", () => {
    it("should render without crashing", async () => {
      render(<CogSixToothSolid data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })