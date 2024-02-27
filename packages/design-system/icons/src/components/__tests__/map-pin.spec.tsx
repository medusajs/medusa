  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import MapPin from "../map-pin"

  describe("MapPin", () => {
    it("should render the icon without errors", async () => {
      render(<MapPin data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })