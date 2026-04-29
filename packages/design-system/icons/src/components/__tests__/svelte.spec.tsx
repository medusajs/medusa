  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Svelte from "../svelte"

  describe("Svelte", () => {
    it("should render the icon without errors", async () => {
      render(<Svelte data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })