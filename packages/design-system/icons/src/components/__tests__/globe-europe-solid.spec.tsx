  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import GlobeEuropeSolid from "../globe-europe-solid"

  describe("GlobeEuropeSolid", () => {
    it("should render without crashing", async () => {
      render(<GlobeEuropeSolid data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })