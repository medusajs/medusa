  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Vite from "../vite"

  describe("Vite", () => {
    it("should render the icon without errors", async () => {
      render(<Vite data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })