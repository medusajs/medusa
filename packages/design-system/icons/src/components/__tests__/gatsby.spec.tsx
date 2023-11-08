  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Gatsby from "../gatsby"

  describe("Gatsby", () => {
    it("should render without crashing", async () => {
      render(<Gatsby data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })