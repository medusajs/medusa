  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import BuildingsSolid from "../buildings-solid"

  describe("BuildingsSolid", () => {
    it("should render without crashing", async () => {
      render(<BuildingsSolid data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })