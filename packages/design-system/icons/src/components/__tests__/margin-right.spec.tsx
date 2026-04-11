  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import MarginRight from "../margin-right"

  describe("MarginRight", () => {
    it("should render the icon without errors", async () => {
      render(<MarginRight data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })