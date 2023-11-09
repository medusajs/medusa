  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Clock from "../clock"

  describe("Clock", () => {
    it("should render without crashing", async () => {
      render(<Clock data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })