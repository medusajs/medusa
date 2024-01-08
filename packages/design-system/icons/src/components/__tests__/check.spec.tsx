  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Check from "../check"

  describe("Check", () => {
    it("should render the icon without errors", async () => {
      render(<Check data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })