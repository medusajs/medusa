  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Visa from "../visa"

  describe("Visa", () => {
    it("should render the icon without errors", async () => {
      render(<Visa data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })