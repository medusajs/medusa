  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import CodeCompare from "../code-compare"

  describe("CodeCompare", () => {
    it("should render the icon without errors", async () => {
      render(<CodeCompare data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })