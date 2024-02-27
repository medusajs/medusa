  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import ChevronLeft from "../chevron-left"

  describe("ChevronLeft", () => {
    it("should render the icon without errors", async () => {
      render(<ChevronLeft data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })