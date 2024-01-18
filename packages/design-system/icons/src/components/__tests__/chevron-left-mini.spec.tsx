  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import ChevronLeftMini from "../chevron-left-mini"

  describe("ChevronLeftMini", () => {
    it("should render the icon without errors", async () => {
      render(<ChevronLeftMini data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })