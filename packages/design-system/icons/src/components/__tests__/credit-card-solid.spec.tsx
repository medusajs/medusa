  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import CreditCardSolid from "../credit-card-solid"

  describe("CreditCardSolid", () => {
    it("should render without crashing", async () => {
      render(<CreditCardSolid data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })