  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import ShoppingBag from "../shopping-bag"

  describe("ShoppingBag", () => {
    it("should render the icon without errors", async () => {
      render(<ShoppingBag data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })