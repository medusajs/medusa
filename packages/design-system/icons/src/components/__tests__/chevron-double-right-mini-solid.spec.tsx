  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import ChevronDoubleRightMiniSolid from "../chevron-double-right-mini-solid"

  describe("ChevronDoubleRightMiniSolid", () => {
    it("should render without crashing", async () => {
      render(<ChevronDoubleRightMiniSolid data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })