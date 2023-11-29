  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import CogSixTooth from "../cog-six-tooth"

  describe("CogSixTooth", () => {
    it("should render without crashing", async () => {
      render(<CogSixTooth data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })