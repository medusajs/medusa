  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Map from "../map"

  describe("Map", () => {
    it("should render the icon without errors", async () => {
      render(<Map data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })