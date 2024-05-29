  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Share from "../share"

  describe("Share", () => {
    it("should render the icon without errors", async () => {
      render(<Share data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })