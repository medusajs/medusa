  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Map from "../map"

  describe("Map", () => {
    it("should render without crashing", async () => {
      render(<Map data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })