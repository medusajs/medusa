  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import SquaresPlusSolid from "../squares-plus-solid"

  describe("SquaresPlusSolid", () => {
    it("should render without crashing", async () => {
      render(<SquaresPlusSolid data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })