  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Medusa from "../medusa"

  describe("Medusa", () => {
    it("should render the icon without errors", async () => {
      render(<Medusa data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })