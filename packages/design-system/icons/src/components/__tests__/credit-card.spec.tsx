  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import CreditCard from "../credit-card"

  describe("CreditCard", () => {
    it("should render without crashing", async () => {
      render(<CreditCard data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })