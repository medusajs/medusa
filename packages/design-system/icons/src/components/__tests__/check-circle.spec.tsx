  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import CheckCircle from "../check-circle"

  describe("CheckCircle", () => {
    it("should render the icon without errors", async () => {
      render(<CheckCircle data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })