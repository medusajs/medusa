  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import ArrrowRight from "../arrrow-right"

  describe("ArrrowRight", () => {
    it("should render without crashing", async () => {
      render(<ArrrowRight data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })