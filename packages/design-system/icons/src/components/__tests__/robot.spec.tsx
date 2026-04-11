  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Robot from "../robot"

  describe("Robot", () => {
    it("should render the icon without errors", async () => {
      render(<Robot data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })