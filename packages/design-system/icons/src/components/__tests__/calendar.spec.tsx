  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Calendar from "../calendar"

  describe("Calendar", () => {
    it("should render the icon without errors", async () => {
      render(<Calendar data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })