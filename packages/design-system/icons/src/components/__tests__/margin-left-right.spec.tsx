  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import MarginLeftRight from "../margin-left-right"

  describe("MarginLeftRight", () => {
    it("should render the icon without errors", async () => {
      render(<MarginLeftRight data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })