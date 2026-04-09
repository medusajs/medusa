  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Astro from "../astro"

  describe("Astro", () => {
    it("should render the icon without errors", async () => {
      render(<Astro data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })