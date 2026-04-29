  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import CreditCardRefresh from "../credit-card-refresh"

  describe("CreditCardRefresh", () => {
    it("should render the icon without errors", async () => {
      render(<CreditCardRefresh data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })