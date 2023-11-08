  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import ChevronDoubleLeft from "../chevron-double-left"

  describe("ChevronDoubleLeft", () => {
    it("should render without crashing", async () => {
      render(<ChevronDoubleLeft data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })