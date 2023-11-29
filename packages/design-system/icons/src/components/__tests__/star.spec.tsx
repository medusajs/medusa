  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Star from "../star"

  describe("Star", () => {
    it("should render without crashing", async () => {
      render(<Star data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })