  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import ReceiptPercent from "../receipt-percent"

  describe("ReceiptPercent", () => {
    it("should render the icon without errors", async () => {
      render(<ReceiptPercent data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })