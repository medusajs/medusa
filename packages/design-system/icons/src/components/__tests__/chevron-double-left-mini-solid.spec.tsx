  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import ChevronDoubleLeftMiniSolid from "../chevron-double-left-mini-solid"

  describe("ChevronDoubleLeftMiniSolid", () => {
    it("should render without crashing", async () => {
      render(<ChevronDoubleLeftMiniSolid data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })