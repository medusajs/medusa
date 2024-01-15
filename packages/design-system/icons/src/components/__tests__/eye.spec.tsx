  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Eye from "../eye"

  describe("Eye", () => {
    it("should render the icon without errors", async () => {
      render(<Eye data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })