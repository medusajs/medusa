  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Buildings from "../buildings"

  describe("Buildings", () => {
    it("should render without crashing", async () => {
      render(<Buildings data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })