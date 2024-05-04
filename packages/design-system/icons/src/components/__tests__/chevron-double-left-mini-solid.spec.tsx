  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import ChevronDoubleLeftMiniSolid from "../chevron-double-left-mini-solid"

  describe("ChevronDoubleLeftMiniSolid", () => {
    it("should render the icon without errors", async () => {
      render(<ChevronDoubleLeftMiniSolid data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })