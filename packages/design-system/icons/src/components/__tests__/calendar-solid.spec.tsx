  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import CalendarSolid from "../calendar-solid"

  describe("CalendarSolid", () => {
    it("should render the icon without errors", async () => {
      render(<CalendarSolid data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })