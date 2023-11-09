  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import CalendarMini from "../calendar-mini"

  describe("CalendarMini", () => {
    it("should render without crashing", async () => {
      render(<CalendarMini data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })