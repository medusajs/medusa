  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import ShoppingCart from "../shopping-cart"

  describe("ShoppingCart", () => {
    it("should render the icon without errors", async () => {
      render(<ShoppingCart data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })