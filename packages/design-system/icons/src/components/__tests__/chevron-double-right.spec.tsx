  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import ChevronDoubleRight from "../chevron-double-right"

  describe("ChevronDoubleRight", () => {
    it("should render without crashing", async () => {
      render(<ChevronDoubleRight data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })