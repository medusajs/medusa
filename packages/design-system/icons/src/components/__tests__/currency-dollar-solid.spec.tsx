  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import CurrencyDollarSolid from "../currency-dollar-solid"

  describe("CurrencyDollarSolid", () => {
    it("should render the icon without errors", async () => {
      render(<CurrencyDollarSolid data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })