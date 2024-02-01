  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import CreditCardSolid from "../credit-card-solid"

  describe("CreditCardSolid", () => {
    it("should render the icon without errors", async () => {
      render(<CreditCardSolid data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })