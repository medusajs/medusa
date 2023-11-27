  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import CurrencyDollar from "../currency-dollar"

  describe("CurrencyDollar", () => {
    it("should render without crashing", async () => {
      render(<CurrencyDollar data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })