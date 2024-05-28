  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import TimelineVertical from "../timeline-vertical"

  describe("TimelineVertical", () => {
    it("should render the icon without errors", async () => {
      render(<TimelineVertical data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })