  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import CalendarMini from "../calendar-mini"

  describe("CalendarMini", () => {
    it("should render the icon without errors", async () => {
      render(<CalendarMini data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })