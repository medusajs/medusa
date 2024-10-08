  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import DescendingSorting from "../descending-sorting"

  describe("DescendingSorting", () => {
    it("should render the icon without errors", async () => {
      render(<DescendingSorting data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })