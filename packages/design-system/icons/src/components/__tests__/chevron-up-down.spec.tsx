  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import ChevronUpDown from "../chevron-up-down"

  describe("ChevronUpDown", () => {
    it("should render without crashing", async () => {
      render(<ChevronUpDown data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })