  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import CalendarSolid from "../calendar-solid"

  describe("CalendarSolid", () => {
    it("should render without crashing", async () => {
      render(<CalendarSolid data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })