  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Receipt from "../receipt"

  describe("Receipt", () => {
    it("should render the icon without errors", async () => {
      render(<Receipt data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })