  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Check from "../check"

  describe("Check", () => {
    it("should render without crashing", async () => {
      render(<Check data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })