  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Snooze from "../snooze"

  describe("Snooze", () => {
    it("should render without crashing", async () => {
      render(<Snooze data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })