  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Bloom from "../bloom"

  describe("Bloom", () => {
    it("should render the icon without errors", async () => {
      render(<Bloom data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })