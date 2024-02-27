  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import ArrrowRight from "../arrrow-right"

  describe("ArrrowRight", () => {
    it("should render the icon without errors", async () => {
      render(<ArrrowRight data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })