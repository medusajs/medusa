  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Apple from "../apple"

  describe("Apple", () => {
    it("should render without crashing", async () => {
      render(<Apple data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })