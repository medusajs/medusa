  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import ChevronLeftMini from "../chevron-left-mini"

  describe("ChevronLeftMini", () => {
    it("should render without crashing", async () => {
      render(<ChevronLeftMini data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })