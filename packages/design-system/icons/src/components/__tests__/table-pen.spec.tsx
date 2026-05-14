  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import TablePen from "../table-pen"

  describe("TablePen", () => {
    it("should render the icon without errors", async () => {
      render(<TablePen data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })