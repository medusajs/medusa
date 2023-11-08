  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import BuildingTax from "../building-tax"

  describe("BuildingTax", () => {
    it("should render without crashing", async () => {
      render(<BuildingTax data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })