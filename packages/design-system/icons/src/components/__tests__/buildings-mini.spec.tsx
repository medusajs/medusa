  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import BuildingsMini from "../buildings-mini"

  describe("BuildingsMini", () => {
    it("should render the icon without errors", async () => {
      render(<BuildingsMini data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })