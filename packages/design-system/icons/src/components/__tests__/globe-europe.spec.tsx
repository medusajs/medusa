  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import GlobeEurope from "../globe-europe"

  describe("GlobeEurope", () => {
    it("should render the icon without errors", async () => {
      render(<GlobeEurope data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })