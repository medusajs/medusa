  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import PlayMiniSolid from "../play-mini-solid"

  describe("PlayMiniSolid", () => {
    it("should render the icon without errors", async () => {
      render(<PlayMiniSolid data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })