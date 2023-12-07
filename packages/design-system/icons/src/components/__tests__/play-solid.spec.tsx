  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import PlaySolid from "../play-solid"

  describe("PlaySolid", () => {
    it("should render without crashing", async () => {
      render(<PlaySolid data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })