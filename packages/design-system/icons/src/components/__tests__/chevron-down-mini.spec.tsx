  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import ChevronDownMini from "../chevron-down-mini"

  describe("ChevronDownMini", () => {
    it("should render the icon without errors", async () => {
      render(<ChevronDownMini data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })