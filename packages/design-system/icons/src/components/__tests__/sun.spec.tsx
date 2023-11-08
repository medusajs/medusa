  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Sun from "../sun"

  describe("Sun", () => {
    it("should render without crashing", async () => {
      render(<Sun data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })