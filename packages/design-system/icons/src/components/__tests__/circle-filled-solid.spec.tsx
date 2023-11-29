  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import CircleFilledSolid from "../circle-filled-solid"

  describe("CircleFilledSolid", () => {
    it("should render without crashing", async () => {
      render(<CircleFilledSolid data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })