  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Sun from "../sun"

  describe("Sun", () => {
    it("should render the icon without errors", async () => {
      render(<Sun data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })