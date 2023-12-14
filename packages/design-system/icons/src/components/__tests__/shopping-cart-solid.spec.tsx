  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import ShoppingCartSolid from "../shopping-cart-solid"

  describe("ShoppingCartSolid", () => {
    it("should render without crashing", async () => {
      render(<ShoppingCartSolid data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })