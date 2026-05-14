  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Globe from "../globe"

  describe("Globe", () => {
    it("should render the icon without errors", async () => {
      render(<Globe data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })