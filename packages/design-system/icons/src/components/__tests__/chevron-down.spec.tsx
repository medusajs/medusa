  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import ChevronDown from "../chevron-down"

  describe("ChevronDown", () => {
    it("should render the icon without errors", async () => {
      render(<ChevronDown data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })