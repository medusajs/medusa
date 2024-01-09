  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import CashSolid from "../cash-solid"

  describe("CashSolid", () => {
    it("should render the icon without errors", async () => {
      render(<CashSolid data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })