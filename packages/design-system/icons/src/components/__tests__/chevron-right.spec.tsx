  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import ChevronRight from "../chevron-right"

  describe("ChevronRight", () => {
    it("should render the icon without errors", async () => {
      render(<ChevronRight data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })