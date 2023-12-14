  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import CircleMiniFilledSolid from "../circle-mini-filled-solid"

  describe("CircleMiniFilledSolid", () => {
    it("should render without crashing", async () => {
      render(<CircleMiniFilledSolid data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })